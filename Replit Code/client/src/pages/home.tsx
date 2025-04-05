import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <AppHeader />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold high-contrast-text mb-4">
                  Take Control of Your Financial Future
                </h1>
                <p className="text-base sm:text-lg text-neutral-900 mb-6">
                  Own Your Day helps you achieve financial freedom with quick, hassle-free loans designed to fit your lifestyle. Submit your application and start your journey today.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 a11y-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium high-contrast-text">Simple Application</h3>
                      <p className="mt-1 text-sm text-neutral-900">Complete our easy-to-use form in just minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 a11y-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium high-contrast-text">Quick Decision</h3>
                      <p className="mt-1 text-sm text-neutral-900">Get an instant approval decision</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 a11y-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium high-contrast-text">Competitive Terms</h3>
                      <p className="mt-1 text-sm text-neutral-900">Benefit from our competitive interest rates</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link href="/application">
                    <Button size="lg" className="a11y-button w-full sm:w-auto">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Benefits card for larger screens */}
              <div className="hidden md:block">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 md:p-8">
                  <div className="rounded-lg bg-white shadow-md p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold high-contrast-text mb-2">Why Choose Us?</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 a11y-icon mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm high-contrast-text">No hidden fees or prepayment penalties</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 a11y-icon mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm high-contrast-text">Secure, encrypted application process</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 a11y-icon mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm high-contrast-text">Dedicated support throughout the process</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 a11y-icon mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm high-contrast-text">Flexible loan terms tailored to your needs</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="pt-4 border-t border-neutral-200">
                        <div className="font-medium high-contrast-text mb-1">Average Customer Rating</div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                              key={star}
                              className="h-5 w-5 text-amber-600" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm font-medium high-contrast-text">4.9/5 (1,285 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile version of the benefits card */}
              <div className="md:hidden mt-6">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
                  <div className="rounded-lg bg-white shadow-md p-4">
                    <div>
                      <h3 className="text-base font-semibold high-contrast-text mb-2">Why Choose Us?</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg className="h-4 w-4 a11y-icon mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 text-xs high-contrast-text">No hidden fees</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-4 w-4 a11y-icon mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 text-xs high-contrast-text">Secure application process</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t border-neutral-200">
                      <div className="font-medium high-contrast-text text-sm mb-1">Average Rating</div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star}
                            className="h-4 w-4 text-amber-600" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-xs font-medium high-contrast-text">4.9/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
}
