import React, { useState } from 'react';
import { Twitter, Github, Linkedin, ArrowUpRight } from 'lucide-react';

const GlassmorphismProfileCard = ({
  avatarUrl,
  name,
  title,
  bio,
  socialLinks = [],
  actionButton,
}: any) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="relative w-full max-w-sm">
      <div 
        className="relative flex flex-col items-center p-8 rounded-3xl border transition-all duration-500 ease-out backdrop-blur-xl bg-card/40 border-white/10"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="w-24 h-24 mb-4 rounded-full p-1 border-2 border-white/20">
          <img 
            src={avatarUrl} 
            alt={`${name}'s Avatar`}
            className="w-full h-full rounded-full object-cover"
            onError={(e: any) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/6366f1/white?text=${name.charAt(0)}`; }}
          />
        </div>

        <h2 className="text-2xl font-bold text-card-foreground">{name}</h2>
        <p className="mt-1 text-sm font-medium text-primary">{title}</p>
        <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">{bio}</p>

        <div className="w-1/2 h-px my-6 rounded-full bg-border" />

        <div className="flex items-center justify-center gap-3">
          {socialLinks.map((item: any) => (
            <SocialButton key={item.id} item={item} setHoveredItem={setHoveredItem} hoveredItem={hoveredItem} />
          ))}
        </div>

        <ActionButton action={actionButton} />
      </div>
      
      <div className="absolute inset-0 rounded-3xl -z-10 transition-all duration-500 ease-out blur-2xl opacity-30 bg-gradient-to-r from-indigo-500/50 to-purple-500/50" />
    </div>
  );
};

const SocialButton = ({ item, setHoveredItem, hoveredItem }: any) => (
  <div className="relative">
    <a
      href={item.href}
      onClick={(e) => e.preventDefault()}
      className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-out group overflow-hidden bg-secondary/50 hover:bg-secondary"
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      aria-label={item.label}
    >
      <div className="relative z-10 flex items-center justify-center">
        <item.icon size={20} className="transition-all duration-200 ease-out text-secondary-foreground/70 group-hover:text-secondary-foreground" />
      </div>
    </a>
    <Tooltip item={item} hoveredItem={hoveredItem} />
  </div>
);

const ActionButton = ({ action }: any) => (
  <a
    href={action.href}
    onClick={(e) => e.preventDefault()}
    className="flex items-center gap-2 px-6 py-3 mt-8 rounded-full font-semibold text-base backdrop-blur-sm transition-all duration-300 ease-out hover:scale-[1.03] active:scale-95 group bg-primary text-primary-foreground"
    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
  >
    <span>{action.text}</span>
    <ArrowUpRight size={16} className="transition-transform duration-300 ease-out group-hover:rotate-45" />
  </a>
);

const Tooltip = ({ item, hoveredItem }: any) => (
  <div 
    role="tooltip"
    className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg backdrop-blur-md border text-xs font-medium whitespace-nowrap transition-all duration-300 ease-out pointer-events-none bg-popover text-popover-foreground border-border ${hoveredItem === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
  >
    {item.label}
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-popover border-b border-r border-border" />
  </div>
);

export function Component() {
  const cardProps = {
    avatarUrl: 'https://vucvdpamtrjkzmubwlts.supabase.co/storage/v1/object/public/users/user_2zMtrqo9RMaaIn4f8F2z3oeY497/avatar.png',
    name: 'Ravi Katiyar',
    title: 'Sr. Designer',
    bio: 'Building beautiful and intuitive digital experiences. Passionate about design systems and web animation.',
    socialLinks: [
      { id: 'github', icon: Github, label: 'GitHub', href: '#' },
      { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', href: '#' },
      { id: 'twitter', icon: Twitter, label: 'Twitter', href: '#' },
    ],
    actionButton: {
      text: 'Contact Me',
      href: '#',
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-sans bg-background transition-colors duration-500 sm:p-8 w-full">
      <GlassmorphismProfileCard {...cardProps} />
    </div>
  );
}
