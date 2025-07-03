import React, { useState } from 'react';
import { THEMES } from '../constants';
import { useThemeStore } from '../store/useThemeStore.js'
import { Send, Palette, Eye } from 'lucide-react';

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  return (
    <div className='min-h-screen bg-base-100' data-theme={theme}>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 max-w-7xl'>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Appearance Settings</h1>
          </div>
          <p className="text-base-content/60 text-base sm:text-lg">Customize your app's look and feel</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Theme Selection - Takes 2/3 width on xl screens */}
          <div className="xl:col-span-2">
            <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-base-300/50 p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-base-content">Choose Your Theme</h2>
                <div className="badge badge-primary badge-sm">
                  {THEMES.length} Available
                </div>
              </div>

              {/* Theme Grid - Mobile optimized */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
                {THEMES.map((t) => (
                  <div
                    key={t}
                    className={`
                      group cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95
                      ${selectedTheme === t ? "scale-105" : ""}
                    `}
                    onClick={() => setSelectedTheme(t)}
                  >
                    {/* Compact Theme Card */}
                    <div className={`
                      relative rounded-lg sm:rounded-xl p-1.5 sm:p-2 border-2 transition-all duration-200
                      ${selectedTheme === t 
                        ? "border-primary shadow-md shadow-primary/20 bg-primary/5" 
                        : "border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-sm"
                      }
                    `}>
                      {/* Compact Theme Preview */}
                      <div className="relative h-10 sm:h-12 w-full rounded-md sm:rounded-lg overflow-hidden mb-1 sm:mb-2 shadow-sm" data-theme={t}>
                        <div className="absolute inset-0 grid grid-cols-4 gap-[1px] p-0.5 sm:p-1">
                          <div className="rounded-sm bg-primary"></div>
                          <div className="rounded-sm bg-secondary"></div>
                          <div className="rounded-sm bg-accent"></div>
                          <div className="rounded-sm bg-neutral"></div>
                        </div>
                        
                        {/* Selection Indicator */}
                        {selectedTheme === t && (
                          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary-content rounded-full"></div>
                          </div>
                        )}
                      </div>

                      {/* Compact Theme Name */}
                      <div className="text-center">
                        <h3 className={`
                          font-medium text-[10px] sm:text-xs transition-colors truncate
                          ${selectedTheme === t ? "text-primary" : "text-base-content/80"}
                        `}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Action Buttons - Mobile optimized */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  onClick={() => setTheme(selectedTheme)}
                  className={`
                    w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3
                    ${selectedTheme === theme 
                      ? "bg-success text-success-content cursor-default shadow-lg" 
                      : "bg-primary text-primary-content hover:bg-primary/90 active:scale-95 sm:hover:scale-105 shadow-lg hover:shadow-xl"
                    }
                  `}
                  disabled={selectedTheme === theme}
                >
                  {selectedTheme === theme ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-success-content rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full"></div>
                      </div>
                      Theme Applied
                    </>
                  ) : (
                    <>
                      <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                      Apply Theme
                    </>
                  )}
                </button>

                {/* Reset to Default Button - Mobile optimized */}
                {theme !== "" && (
                  <button
                    onClick={() => {
                      setTheme("");
                      setSelectedTheme("");
                    }}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 bg-base-300 text-base-content hover:bg-base-300/80 active:scale-95 sm:hover:scale-105 shadow-md hover:shadow-lg border border-base-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset to Default
                  </button>
                )}
              </div>

              {/* Success Message for Default Theme */}
              {theme === "" && selectedTheme === "" && (
                <div className="flex justify-center mt-4">
                  <div className="px-4 py-2 bg-success/10 text-success rounded-xl border border-success/20 flex items-center gap-2 animate-pulse">
                    <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-success-content rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">Default theme applied</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section - Takes 1/3 width on xl screens */}
          <div className="xl:col-span-1">
            <div className="bg-base-200/50 backdrop-blur-sm rounded-3xl border border-base-300/50 p-8 shadow-xl h-fit sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-base-content">Live Preview</h3>
              </div>
              
              <div className="bg-base-300/30 rounded-2xl p-6">
                {/* Mock Chat UI with preview theme */}
                <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300" data-theme={selectedTheme}>
                  {/* Chat Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-content">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-content/20 backdrop-blur-sm flex items-center justify-center font-bold shadow-lg">
                        A
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Abhinav Dubey</h3>
                        <p className="text-xs opacity-80">Online now</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-gradient-to-b from-base-50/50 to-base-100/50">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`
                            max-w-[85%] rounded-2xl px-4 py-3 shadow-sm
                            ${message.isSent 
                              ? "bg-primary text-primary-content rounded-br-md shadow-lg" 
                              : "bg-base-100 text-base-content rounded-bl-md border border-base-200"
                            }
                          `}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p
                            className={`
                              text-[10px] mt-2 font-medium opacity-70
                              ${message.isSent ? "text-primary-content" : "text-base-content"}
                            `}
                          >
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-base-200 bg-base-100">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-sm h-12 rounded-xl bg-base-50 border-base-200 focus:bg-base-100 transition-all"
                        placeholder="Type a message..."
                        value="This is a preview"
                        readOnly
                      />
                      <button className="btn btn-primary h-12 min-h-0 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Info */}
              <div className="mt-4 p-4 bg-info/10 rounded-xl border border-info/20">
                <p className="text-sm text-info font-medium">
                  👆 This preview shows how "{selectedTheme}" theme looks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;