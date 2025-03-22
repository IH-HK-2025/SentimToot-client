import {
    Anchor,
    Button,
    Container,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
    Alert,
    } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import {  useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import axios from "axios";
 
  
  const API_URL = import.meta.env.VITE_API_URL;
  
  interface FormValues {
    email: string;
    password: string;
  }
  
  const ForgotPassword = () => {
    const navigate = useNavigate();
    
    
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  
    const form = useForm<FormValues>({
      initialValues: {
        email: "",
        password: "",
      },
  
      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      },
    });
  
    const handleSubmit = async (values: FormValues) => {
      try {
        setLoading(true);
        const response = await axios.put(`${API_URL}/api/auth/password`, values);
  
       
        await response.data;
        navigate("/signin");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(error.response?.data?.message || "Invalid credentials");
        } else {
          setErrorMessage("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Container size={420} my={40} mt={120}>
        <Title ta="center" mb="md">
          Welcome Back
        </Title>
  
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Don't have an account?{" "}
          <Anchor component={Link} to="/signup" size="sm">
            Create account
          </Anchor>
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              {...form.getInputProps("email")}
            />
  
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              required
              {...form.getInputProps("password")}
            />
  
        
  
            {errorMessage && (
              <Alert color="red" mt="md" title="Error" variant="light">
                {errorMessage}
              </Alert>
            )}
  
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              Submit
            </Button>
          </form>
        </Paper>
      </Container>
    );
  };
  
  export default ForgotPassword;
  