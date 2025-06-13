"use client"

import type React from "react"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [inputColor, setInputColor] = useState(color)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value)
    onChange(e.target.value)
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputColor(value)
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onChange(value)
    }
  }

  const presetColors = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff",
    "#c0c0c0",
    "#808080",
    "#800000",
    "#808000",
    "#008000",
    "#800080",
    "#008080",
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-10 h-10 rounded-md border border-input"
              style={{ backgroundColor: color }}
              aria-label="Pick a color"
            />
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <div>
                <input
                  type="color"
                  value={inputColor}
                  onChange={handleColorChange}
                  className="w-full h-8 cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-5 gap-1">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    className="w-8 h-8 rounded-md border border-input"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => {
                      setInputColor(presetColor)
                      onChange(presetColor)
                    }}
                    aria-label={`Select color ${presetColor}`}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input value={inputColor} onChange={handleHexInputChange} className="w-28" placeholder="#000000" />
      </div>
    </div>
  )
}
