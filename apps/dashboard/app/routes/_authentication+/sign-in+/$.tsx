import { SignIn } from "@clerk/remix";
import { Flex, Grid, Heading } from "@radix-ui/themes";
const Login = () => {
	return (
		<Grid gap="4">
			<Heading size="8" align="center" className="font-freeman pb-4">
				Войдите
			</Heading>

			<Flex direction="column" justify="center" gap="4" align="center">
				<SignIn />
			</Flex>
		</Grid>
	);
};
export default Login;
