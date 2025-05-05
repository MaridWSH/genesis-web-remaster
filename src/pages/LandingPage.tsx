
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  ListTodo, 
  BarChart4, 
  Users, 
  Sparkles, 
  Shield, 
  Medal, 
  Clock,
  Star
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#3EBCB5]/90 to-[#2A8D88]/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Boost Productivity with TaskMaster
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-lg">
                The all-in-one task management platform that helps teams collaborate, track progress, and achieve more together.
              </p>
              <div className="flex space-x-4">
                <Button asChild size="lg" className="bg-white text-[#3EBCB5] hover:bg-white/90 font-medium shadow-md">
                  <Link to="/register">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <div className="relative">
                {/* Task card mockup */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20 transform rotate-3 absolute -right-4 top-4 w-64">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-green-400/50 mr-3"></div>
                      <div className="h-4 w-full bg-white/20 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-yellow-400/50 mr-3"></div>
                      <div className="h-4 w-full bg-white/20 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-blue-400/50 mr-3"></div>
                      <div className="h-4 w-full bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* Main card mockup */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20 relative z-10">
                  <div className="space-y-3">
                    <div className="h-6 w-32 bg-white/20 rounded mb-4"></div>
                    <div className="flex items-center p-3 bg-white/10 rounded-md">
                      <div className="h-5 w-5 rounded-full bg-green-400/50 mr-3"></div>
                      <div className="h-4 w-full bg-white/20 rounded"></div>
                    </div>
                    <div className="flex items-center p-3 bg-white/10 rounded-md">
                      <div className="h-5 w-5 rounded-full bg-yellow-400/50 mr-3"></div>
                      <div className="h-4 w-full bg-white/20 rounded"></div>
                    </div>
                    <div className="flex items-center p-3 bg-white/10 rounded-md">
                      <div className="h-5 w-5 rounded-full bg-blue-400/50 mr-3"></div>
                      <div className="h-4 w-full bg-white/20 rounded"></div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <div className="h-8 w-24 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#3EBCB5] to-blue-600 bg-clip-text text-transparent">Powerful Features for Teams & Individuals</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              TaskMaster comes with all the tools you need to stay organized, focused, and productive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={ListTodo} 
              title="Smart Task Management" 
              description="Create, organize, and track your tasks with advanced filtering, labels, priorities, and deadlines."
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <FeatureCard 
              icon={Users} 
              title="Team Collaboration" 
              description="Share tasks, assign responsibilities, and communicate effectively with your team members."
              color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            />
            <FeatureCard 
              icon={Calendar} 
              title="Calendar Integration" 
              description="Visualize your schedule with a powerful calendar view that syncs with your favorite calendar apps."
              color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            />
            <FeatureCard 
              icon={BarChart4} 
              title="Insightful Analytics" 
              description="Track your productivity with detailed statistics, progress reports, and performance metrics."
              color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            />
            <FeatureCard 
              icon={Medal} 
              title="Gamification & Rewards" 
              description="Stay motivated with achievements, points, and rewards as you complete tasks and reach goals."
              color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
            />
            <FeatureCard 
              icon={Sparkles} 
              title="AI Assistant" 
              description="Get smart suggestions, auto-prioritization, and task optimization with our AI assistant."
              color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#3EBCB5] to-blue-600 bg-clip-text text-transparent">How TaskMaster Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and transform how you manage your tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard 
              number="1" 
              title="Create an Account" 
              description="Sign up for free and set up your workspace in seconds."
            />
            <StepCard 
              number="2" 
              title="Add Your Tasks" 
              description="Create tasks with details, priorities, deadlines, and categories."
            />
            <StepCard 
              number="3" 
              title="Collaborate" 
              description="Invite team members to collaborate on shared projects and tasks."
            />
            <StepCard 
              number="4" 
              title="Track Progress" 
              description="Monitor completion, analyze performance, and celebrate achievements."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#3EBCB5] to-blue-600 bg-clip-text text-transparent">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their productivity with TaskMaster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="TaskMaster has completely changed how my team collaborates. We're more organized and productive than ever!"
              author="Sarah Johnson"
              role="Marketing Director"
              rating={5}
            />
            <TestimonialCard 
              quote="The analytics and insights have helped me identify bottlenecks in my workflow and improve my productivity by 40%."
              author="Michael Chen"
              role="Software Developer"
              rating={5}
            />
            <TestimonialCard 
              quote="I love how the AI assistant helps me prioritize my tasks. It's like having a personal productivity coach."
              author="Aisha Patel"
              role="Freelance Designer"
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#3EBCB5] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their tasks more efficiently with TaskMaster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#3EBCB5] hover:bg-white/90 font-medium shadow-md">
              <Link to="/register">Start Free Trial <ArrowRight size={16} className="ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/features">See All Features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">TaskMaster</h3>
              <p className="text-gray-400 max-w-xs">
                Your all-in-one task management platform for individuals and teams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="/features" className="text-gray-400 hover:text-white">Features</a></li>
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
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  color: string 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      <div className={`h-12 w-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 relative hover:shadow-lg transition-shadow duration-300">
      <div className="absolute top-4 right-4 h-8 w-8 bg-[#3EBCB5] text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="mb-6 h-1 w-16 bg-gradient-to-r from-[#3EBCB5] to-blue-500"></div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role, rating }: { quote: string, author: string, role: string, rating: number }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      <div className="mb-4 text-[#3EBCB5]">
        <CheckCircle className="h-6 w-6" />
      </div>
      <div className="flex mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default LandingPage;
