import Link from "next/link";

import ListView from "@/components/shared/list-view";
import { DotPattern } from "@/components/ui/dot-pattern";
import { termsOfServices } from "@/constants";

const TermOfServices = () => {
  return (
    <div className="relative py-10">
      <DotPattern />
      <div>
        <div className="container">
          <section className="relative flex w-full flex-col items-center justify-center space-y-2 overflow-visible py-14">
            <h1 className="text-2xl font-semibold md:text-4xl">
              Terms of Service
            </h1>
            <p className="w-full text-center text-sm md:w-4/5 md:text-base">
              Welcome to Simplify! These Terms of Service (“Terms”) govern your
              use of our website, mobile application, and any related services
              (collectively, the “Service”). By accessing or using Simplify, you
              agree to be bound by these Terms. If you do not agree with any
              part of these Terms, please do not use our Service.
            </p>
          </section>
          <div className="relative space-y-8 pb-20">
            {/* <RadialGradient className="!-left-full !-top-1/2" /> */}
            {termsOfServices.map((policy, idx) => (
              <ListView
                key={idx}
                title={policy.title}
                description={policy.description}
                data={policy.data}
              />
            ))}
            <article className="mx-auto mt-10 max-w-5xl">
              <h5 className="text-2xl font-semibold">Contact us</h5>
              <p className="mt-2 font-medium">
                If you have any questions or concerns about this Privacy Policy
                or our practices regarding your information, please contact us
                at&nbsp;
                <Link
                  href={"mailto:ksujeetkumar7678@gmail.com"}
                  target="_blank"
                  className="hover:underline"
                >
                  <strong>ksujeetkumar7678@gmail.com</strong>
                </Link>
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermOfServices;
