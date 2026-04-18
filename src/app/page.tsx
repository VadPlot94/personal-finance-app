import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-black">FinanceApp</div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-black px-4 py-2 text-white hover:bg-slate-800"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 py-15 sm:px-6 lg:px-6">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Keep track of your money and save for the future
          </h1>
          <p className="mb-8 text-xl text-slate-600">
            Personal finance app help you to control your spending in one place.
            Track transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to manage your personal finances effectively.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Track Transactions",
                description:
                  "Monitor all your income and expenses in one place. Get detailed insights into your spending patterns.",
                icon: "💰",
              },
              {
                title: "Smart Budgets",
                description:
                  "Set category-based budgets and watch your spending in real-time. Stay in control of your finances.",
                icon: "📊",
              },
              {
                title: "Savings Pots",
                description:
                  "Create multiple savings goals and track your progress toward achieving them easily.",
                icon: "🎯",
              },
              {
                title: "Recurring Bills",
                description:
                  "Keep track of your recurring payments and never miss a bill deadline.",
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
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Get started in just four simple steps. Less than 5 minutes to set
              up.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Create Your Account",
                description:
                  "Sign up with your email and secure password. Verify to get started.",
              },
              {
                step: "02",
                title: "Add Your Transactions",
                description:
                  "Manually add transactions or import them. Categorize with ease.",
              },
              {
                step: "03",
                title: "Set Your Budget",
                description:
                  "Define spending limits for different categories based on goals.",
              },
              {
                step: "04",
                title: "Monitor & Adjust",
                description:
                  "Watch progress on dashboard, visualize trends, adjust as needed.",
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
            Ready to Take Control?
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Join thousands of users who are already managing their finances
            smarter. Start your journey to financial freedom today.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-black px-8 py-3 font-semibold text-white hover:bg-slate-800"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold text-slate-900">FinanceApp</h3>
              <p className="mt-2 text-slate-600">
                Your trusted personal finance management tool for a better
                financial future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Features</h4>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>
                  <a href="/transactions" className="hover:text-slate-900">
                    Transactions
                  </a>
                </li>
                <li>
                  <a href="/budgets" className="hover:text-slate-900">
                    Budgets
                  </a>
                </li>
                <li>
                  <a href="/pots" className="hover:text-slate-900">
                    Savings Pots
                  </a>
                </li>
                <li>
                  <a href="/recurring" className="hover:text-slate-900">
                    Recurring Bills
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Account</h4>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>
                  <Link href="/login" className="hover:text-slate-900">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-slate-900">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-8 text-center text-slate-600">
            <p>&copy; 2025 FinanceApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
