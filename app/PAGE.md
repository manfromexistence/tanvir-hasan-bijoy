import { getLocale } from "@/get-locales";
import { Locale } from "@/i18n-config";
import { LocaleInitializer } from "@/components/locale-initializer";
import AiInput from "@/components/chat/ai-input";

export default async function IndexPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const locale = await getLocale(lang);

  return (
    <>
      <LocaleInitializer locale={lang} data={locale} />
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{locale["friday"].title}</h1>
          <p className="text-muted-foreground">
            {locale["friday"].welcome}
          </p>
        </div>
        <AiInput />
      </div>
    </>
  );
}
