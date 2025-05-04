
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Calendar, ListTodo, BarChart4 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/80 to-primary/60 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                TaskMaster - Organize Your Life With Ease
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                A simple, powerful task management app designed to help you track, organize, and complete your tasks efficiently.
              </p>
              <div className="flex space-x-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20">
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center p-3 bg-white/10 rounded-md">
                      <div className="h-5 w-5 rounded-full bg-white/20 mr-3"></div>
                      <div className="h-4 w-full bg-white/20 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Stay Productive</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              TaskMaster comes packed with all the features you need to organize your work and life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={ListTodo} 
              title="Task Management" 
              description="Create, organize, and track your tasks with ease. Set priorities, due dates, and categories."
            />
            <FeatureCard 
              icon={Calendar} 
              title="Calendar View" 
              description="See your tasks in a calendar view to better plan your day, week, or month."
            />
            <FeatureCard 
              icon={BarChart4} 
              title="Analytics Dashboard" 
              description="Get insights into your productivity with detailed statistics and charts."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How TaskMaster Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and transform how you manage your tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              number="1" 
              title="Create an Account" 
              description="Sign up for free and set up your TaskMaster profile in seconds."
            />
            <StepCard 
              number="2" 
              title="Add Your Tasks" 
              description="Start adding tasks, setting priorities, due dates, and organizing them into categories."
            />
            <StepCard 
              number="3" 
              title="Track Progress" 
              description="Mark tasks as completed, archive them, or reschedule as needed."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their productivity with TaskMaster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard 
              quote="TaskMaster has completely changed how I organize my work. I'm more productive than ever!"
              author="Sarah Johnson"
              role="Marketing Manager"
            />
            <TestimonialCard 
              quote="Simple, intuitive, and powerful. Exactly what I needed to keep track of my daily tasks."
              author="Michael Chen"
              role="Software Developer"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their tasks more efficiently with TaskMaster.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/register">Create Free Account <ArrowRight size={16} className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-4">TaskMaster</h3>
              <p className="text-gray-400 max-w-xs">
                A simple, powerful task management app to help you stay organized and productive.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="h-12 w-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative">
      <div className="absolute top-4 right-4 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <CheckCircle className="h-6 w-6 text-primary" />
      </div>
      <p className="text-lg mb-4 italic text-gray-600 dark:text-gray-400">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default LandingPage;
