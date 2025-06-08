import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Text,
	Tailwind,
	Section,
} from "@react-email/components";
import { lt } from "../utils";

interface BetterAuthResetPasswordEmailProps {
	username?: string;
	resetLink?: string;
}

export const ResetPasswordEmail = ({
	username,
	resetLink,
}: BetterAuthResetPasswordEmailProps) => {
	const previewText = lt("authentication.reset-password-email-subject");
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans px-2">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
							<span dangerouslySetInnerHTML={{ __html: lt("authentication.reset-password-email-title") }} />
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							{lt("authentication.reset-password-email-greeting").replace("{username}", username || "")}
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							{lt("authentication.reset-password-email-body")}
						</Text>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
								href={resetLink}
							>
								{lt("authentication.reset-password-button")}
							</Button>
						</Section>
						<Text className="text-black text-[14px] leading-[24px]">
							{lt("authentication.reset-password-email-link-text")}{" "}
							<Link href={resetLink} className="text-blue-600 no-underline">
								{resetLink}
							</Link>
						</Text>
						<Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
						<Text className="text-[#666666] text-[12px] leading-[24px]">
							{lt("authentication.reset-password-email-footer")}
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export function reactResetPasswordEmail(
	props: BetterAuthResetPasswordEmailProps,
) {
	console.log(props);
	return <ResetPasswordEmail {...props} />;
}
