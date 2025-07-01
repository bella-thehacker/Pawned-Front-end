"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { CustomButton } from "@/components/CustomButton"
import { Volume2, Palette, Type, RotateCcw } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "retro",
    soundEffects: true,
    music: false,
    font: "mono",
    boardStyle: "classic",
    animations: true,
    notifications: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings({
      theme: "retro",
      soundEffects: true,
      music: false,
      font: "mono",
      boardStyle: "classic",
      animations: true,
      notifications: true,
    })
  }

  return (
    <div className="min-h-screen bg-vintage-off-white">
      <TopNav showBack title="Settings" />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Theme Settings */}
          <div className="retro-card">
            <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-6 flex items-center gap-3">
              <Palette size={24} />
              Appearance
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-sm text-vintage-sepia mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange("theme", e.target.value)}
                  className="w-full p-3 border-2 border-vintage-sepia bg-vintage-parchment font-mono"
                >
                  <option value="retro">Retro Vintage (Default)</option>
                  <option value="dark">Dark Mode</option>
                  <option value="modern">Modern Clean</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-sm text-vintage-sepia mb-2">Board Style</label>
                <select
                  value={settings.boardStyle}
                  onChange={(e) => handleSettingChange("boardStyle", e.target.value)}
                  className="w-full p-3 border-2 border-vintage-sepia bg-vintage-parchment font-mono"
                >
                  <option value="classic">Classic Wood</option>
                  <option value="vintage">Vintage Paper</option>
                  <option value="minimal">Minimal</option>
                  <option value="marble">Marble</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="retro-card">
            <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-6 flex items-center gap-3">
              <Volume2 size={24} />
              Audio
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-vintage-sepia">Sound Effects</div>
                  <div className="font-mono text-xs text-vintage-sepia/60">Piece moves, captures, check sounds</div>
                </div>
                <button
                  onClick={() => handleSettingChange("soundEffects", !settings.soundEffects)}
                  className={`w-12 h-6 rounded-full border-2 border-vintage-sepia transition-colors ${
                    settings.soundEffects ? "bg-vintage-olive" : "bg-vintage-sepia/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-vintage-off-white rounded-full transition-transform ${
                      settings.soundEffects ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-vintage-sepia">Background Music</div>
                  <div className="font-mono text-xs text-vintage-sepia/60">Ambient chess lounge music</div>
                </div>
                <button
                  onClick={() => handleSettingChange("music", !settings.music)}
                  className={`w-12 h-6 rounded-full border-2 border-vintage-sepia transition-colors ${
                    settings.music ? "bg-vintage-olive" : "bg-vintage-sepia/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-vintage-off-white rounded-full transition-transform ${
                      settings.music ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Typography Settings */}
          <div className="retro-card">
            <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-6 flex items-center gap-3">
              <Type size={24} />
              Typography
            </h3>

            <div>
              <label className="block font-mono text-sm text-vintage-sepia mb-2">Font Style</label>
              <select
                value={settings.font}
                onChange={(e) => handleSettingChange("font", e.target.value)}
                className="w-full p-3 border-2 border-vintage-sepia bg-vintage-parchment font-mono"
              >
                <option value="mono">IBM Plex Mono (Default)</option>
                <option value="serif">Playfair Display</option>
                <option value="typewriter">Courier New</option>
                <option value="pixel">Pixel Font</option>
              </select>
            </div>
          </div>

          {/* Game Settings */}
          <div className="retro-card">
            <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-6">Game Preferences</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-vintage-sepia">Animations</div>
                  <div className="font-mono text-xs text-vintage-sepia/60">Piece movement animations</div>
                </div>
                <button
                  onClick={() => handleSettingChange("animations", !settings.animations)}
                  className={`w-12 h-6 rounded-full border-2 border-vintage-sepia transition-colors ${
                    settings.animations ? "bg-vintage-olive" : "bg-vintage-sepia/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-vintage-off-white rounded-full transition-transform ${
                      settings.animations ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-vintage-sepia">Notifications</div>
                  <div className="font-mono text-xs text-vintage-sepia/60">Game alerts and reminders</div>
                </div>
                <button
                  onClick={() => handleSettingChange("notifications", !settings.notifications)}
                  className={`w-12 h-6 rounded-full border-2 border-vintage-sepia transition-colors ${
                    settings.notifications ? "bg-vintage-olive" : "bg-vintage-sepia/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-vintage-off-white rounded-full transition-transform ${
                      settings.notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Reset Settings */}
          <div className="retro-card">
            <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-4 flex items-center gap-3">
              <RotateCcw size={24} />
              Reset
            </h3>

            <p className="font-mono text-sm text-vintage-sepia/80 mb-4">
              Reset all settings to their default values. This action cannot be undone.
            </p>

            <CustomButton variant="accent" onClick={resetSettings} className="flex items-center gap-2">
              <RotateCcw size={16} />
              Reset to Defaults
            </CustomButton>
          </div>

          {/* Save Settings */}
          <div className="text-center">
            <CustomButton size="lg" className="px-12">
              Save Settings
            </CustomButton>
          </div>
        </div>
      </main>
    </div>
  )
}
