import Link from "next/link";
import { getTranslations } from "next-intl/server";
import CreateAccountLink from "@/front-end/components/create-account-link";
import SignInButton from "@/front-end/components/sign-in-button/sign-in-button";
import constants from "@/shared/services/constants.service";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-black">
              {t("i18n.LandingPage.Brand")}
            </div>
            <div className="flex gap-4">
              <SignInButton className="px-4" />
              <Link
                href={constants.AppRoutes.overview}
                className="rounded-lg bg-black px-4 py-2 text-white hover:bg-slate-800"
              >
                {t("i18n.LandingPage.GetStarted")}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 py-15 sm:px-6 lg:px-6">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
            {t("i18n.LandingPage.HeroTitle")}
          </h1>
          <p className="mb-8 text-xl text-slate-600">
            {t("i18n.LandingPage.HeroBody")}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">
              {t("i18n.LandingPage.FeaturesTitle")}
            </h2>
            <p className="text-lg text-slate-600">
              {t("i18n.LandingPage.FeaturesSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: t("i18n.LandingPage.FeatureTransactionsTitle"),
                description: t("i18n.LandingPage.FeatureTransactionsBody"),
                icon: "💰",
              },
              {
                title: t("i18n.LandingPage.FeatureBudgetsTitle"),
                description: t("i18n.LandingPage.FeatureBudgetsBody"),
                icon: "📊",
              },
              {
                title: t("i18n.LandingPage.FeaturePotsTitle"),
                description: t("i18n.LandingPage.FeaturePotsBody"),
                icon: "🎯",
              },
              {
                title: t("i18n.LandingPage.FeatureRecurringTitle"),
                description: t("i18n.LandingPage.FeatureRecurringBody"),
                icon: "📅",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">
              {t("i18n.LandingPage.HowItWorksTitle")}
            </h2>
            <p className="text-lg text-slate-600">
              {t("i18n.LandingPage.HowItWorksSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: t("i18n.LandingPage.Step1Title"),
                description: t("i18n.LandingPage.Step1Body"),
              },
              {
                step: "02",
                title: t("i18n.LandingPage.Step2Title"),
                description: t("i18n.LandingPage.Step2Body"),
              },
              {
                step: "03",
                title: t("i18n.LandingPage.Step3Title"),
                description: t("i18n.LandingPage.Step3Body"),
              },
              {
                step: "04",
                title: t("i18n.LandingPage.Step4Title"),
                description: t("i18n.LandingPage.Step4Body"),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-4 text-5xl font-bold text-slate-200">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-slate-900">
            {t("i18n.LandingPage.CtaTitle")}
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            {t("i18n.LandingPage.CtaBody")}
          </p>
          <Link
            href={constants.AppRoutes.login}
            className="inline-block rounded-lg bg-black px-8 py-3 font-semibold text-white hover:bg-slate-800"
          >
            {t("i18n.LandingPage.CreateFreeAccount")}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("i18n.LandingPage.Brand")}
              </h3>
              <p className="mt-2 text-slate-600">
                {t("i18n.LandingPage.FooterTagline")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">
                {t("i18n.LandingPage.FooterFeatures")}
              </h4>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>
                  <a
                    href={constants.AppRoutes.transactions}
                    className="hover:text-slate-900"
                  >
                    {t("i18n.Navigation.Transactions")}
                  </a>
                </li>
                <li>
                  <a
                    href={constants.AppRoutes.budgets}
                    className="hover:text-slate-900"
                  >
                    {t("i18n.Navigation.Budgets")}
                  </a>
                </li>
                <li>
                  <a
                    href={constants.AppRoutes.pots}
                    className="hover:text-slate-900"
                  >
                    {t("i18n.LandingPage.FooterSavingsPots")}
                  </a>
                </li>
                <li>
                  <a
                    href={constants.AppRoutes.recurring}
                    className="hover:text-slate-900"
                  >
                    {t("i18n.Navigation.Recurring")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">
                {t("i18n.LandingPage.FooterAccount")}
              </h4>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>
                  <SignInButton className="hover:b-none" />
                </li>
                <li>
                  <CreateAccountLink />
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-8 text-center text-slate-600">
            <p>
              {t("i18n.LandingPage.Copyright", {
                year: new Date().getFullYear(),
              })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
