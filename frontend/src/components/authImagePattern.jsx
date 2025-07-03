import {
  Globe,
  MessageSquare,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

const AuthImagePattern = () => {
  return (
    <div className="flex-1 bg-base-200/30 relative overflow-hidden hidden lg:flex items-center justify-center p-8">
      {/* Theme-adaptive background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Enhanced floating chat bubbles */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-12 bg-base-100/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-base-300/60 animate-bounce max-w-xs hover:shadow-2xl transition-shadow duration-300"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-primary/20">
              <span className="text-primary-content font-semibold text-sm">A</span>
            </div>
            <div>
              <p className="text-base-content font-medium text-sm">Alex</p>
              <p className="text-base-content/70 text-xs">2 min ago</p>
            </div>
          </div>
          <p className="text-base-content text-sm">Hey! Just joined BingeChat! 🎉</p>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md -z-10"></div>
        </div>

        <div
          className="absolute top-40 right-16 bg-secondary/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-secondary/30 animate-bounce max-w-xs hover:shadow-2xl transition-shadow duration-300"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        >
          <p className="text-secondary-content text-sm font-medium">Welcome to the community! 🚀</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3 h-3 text-warning" />
            <span className="text-secondary-content/90 text-xs font-medium">You</span>
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-secondary/10 rounded-2xl blur-md -z-10"></div>
        </div>

        <div
          className="absolute bottom-32 left-20 bg-base-100/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-base-300/60 animate-bounce max-w-xs hover:shadow-2xl transition-shadow duration-300"
          style={{ animationDelay: "2s", animationDuration: "3s" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-md border-2 border-success/20">
              <span className="text-success-content font-semibold text-sm">S</span>
            </div>
            <div>
              <p className="text-base-content font-medium text-sm">Sarah</p>
              <p className="text-base-content/70 text-xs">just now</p>
            </div>
          </div>
          <p className="text-base-content text-sm">Let's start chatting! 💬✨</p>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-success/5 rounded-2xl blur-md -z-10"></div>
        </div>

        {/* Enhanced floating icons with theme colors */}
        <div className="absolute top-32 right-8 p-2 bg-base-100/80 backdrop-blur-sm rounded-full border border-base-300/50 shadow-lg">
          <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
        </div>
        <div 
          className="absolute bottom-20 right-12 p-2 bg-base-100/80 backdrop-blur-sm rounded-full border border-base-300/50 shadow-lg"
          style={{ animationDelay: "2s" }}
        >
          <Zap className="w-5 h-5 text-warning animate-pulse" />
        </div>
        <div 
          className="absolute top-1/2 left-8 p-2 bg-base-100/80 backdrop-blur-sm rounded-full border border-base-300/50 shadow-lg"
          style={{ animationDelay: "4s" }}
        >
          <Users className="w-5 h-5 text-primary animate-pulse" />
        </div>
      </div>

      <div className="text-center z-10 relative max-w-md">
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Enhanced main logo */}
            <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-3xl flex items-center justify-center shadow-2xl border-4 border-primary/20 relative overflow-hidden group">
              <MessageSquare className="w-10 h-10 text-primary-content relative z-10" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/30 rounded-3xl blur-lg scale-110 -z-10"></div>
            </div>
            
            {/* Enhanced notification badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-lg border-2 border-base-100">
              <span className="text-secondary-content text-xs font-bold">+</span>
              <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-30"></div>
            </div>
          </div>
          
          {/* Theme-adaptive title */}
          <div className="relative mb-4">
            <h2 className="text-3xl font-bold text-base-content relative z-10">
              <span className="relative">
                Experience BingeChat
                {/* Decorative underline */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-40"></div>
              </span>
            </h2>
            {/* Background text for depth */}
            <div className="absolute inset-0 text-3xl font-bold text-primary/5 blur-sm">
              Experience BingeChat
            </div>
          </div>
          
          {/* Enhanced subtitle */}
          <div className="relative">
            <p className="text-base-content/80 text-lg leading-relaxed relative z-10 bg-base-100/30 backdrop-blur-sm px-4 py-2 rounded-full border border-base-300/30">
              Join millions of users creating amazing conversations and building meaningful connections
            </p>
          </div>
        </div>

        {/* Enhanced feature grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              Icon: Smartphone,
              title: "Mobile Ready",
              subtitle: "Chat anywhere",
              themeColor: "primary",
            },
            {
              Icon: Zap,
              title: "Lightning Fast",
              subtitle: "Real-time sync",
              themeColor: "secondary",
            },
            {
              Icon: Users,
              title: "Group Chats",
              subtitle: "Connect teams",
              themeColor: "success",
            },
            {
              Icon: Globe,
              title: "Global Reach",
              subtitle: "Worldwide users",
              themeColor: "info",
            },
          ].map(({ Icon, title, subtitle, themeColor }, i) => (
            <div
              key={i}
              className="bg-base-100/70 backdrop-blur-md rounded-xl p-4 text-center hover:bg-base-100/90 transition-all duration-300 border-2 border-base-300/40 hover:shadow-xl hover:border-base-300/60 group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-16 h-16 bg-${themeColor}/5 rounded-full blur-xl transform translate-x-4 -translate-y-4`}></div>
              
              <div
                className={`w-12 h-12 mx-auto mb-3 bg-${themeColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border-2 border-${themeColor}/20 relative z-10`}
              >
                <Icon className={`w-6 h-6 text-${themeColor}-content`} />
                {/* Icon glow */}
                <div className={`absolute inset-0 bg-${themeColor}/20 rounded-xl blur-md scale-110 -z-10`}></div>
              </div>
              
              <p className="text-base-content font-semibold text-sm relative z-10">{title}</p>
              <p className="text-base-content/70 text-xs mt-1 relative z-10">{subtitle}</p>
            </div>
          ))}
        </div>

        {/* Enhanced rating section */}
        <div className="mt-8 pt-6 border-t-2 border-base-300/50 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 bg-base-200 rounded-full">
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-3 h-3 text-warning fill-current animate-pulse" 
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-base-100/50 backdrop-blur-sm rounded-full px-6 py-3 border border-base-300/50 inline-block">
            <div className="flex items-center justify-center gap-2 text-base-content">
              <Star className="w-4 h-4 text-warning fill-current" />
              <span className="text-sm font-medium">Rated 4.9/5 by 50K+ users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;