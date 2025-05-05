"use client"

import type React from "react"

import { useState } from "react"
import { Check, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const threatLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

export default function DataCollectionForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setStep(1)
      setIsSuccess(false)
    }, 3000)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-md">
      <CardHeader>
        <CardTitle>Intelligence Data Collection</CardTitle>
        <CardDescription>Submit new intelligence data for analysis and processing</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="data-collection-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-name">Target Name</Label>
                <Input
                  id="target-name"
                  placeholder="Enter target name or codename"
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" placeholder="Geographic region" required className="bg-zinc-800 border-zinc-700" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Threat Level</Label>
                <RadioGroup defaultValue="medium" className="grid grid-cols-2 gap-2">
                  {threatLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.value} id={`threat-${level.value}`} className="border-zinc-700" />
                      <Label htmlFor={`threat-${level.value}`}>{level.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Last Known Location</Label>
                <Input
                  id="location"
                  placeholder="Coordinates or location description"
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  placeholder="Enter detailed intelligence information"
                  rows={5}
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && !isSuccess && (
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isSubmitting}>
            Back
          </Button>
        )}
        {step < 3 && !isSuccess && (
          <Button className="ml-auto" onClick={() => setStep(step + 1)}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
        {step === 3 && !isSuccess && (
          <Button
            type="submit"
            form="data-collection-form"
            disabled={isSubmitting}
            className="ml-auto bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting
              </>
            ) : (
              "Submit Intelligence"
            )}
          </Button>
        )}
        {isSuccess && (
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center text-emerald-500">
              <Check className="mr-2 h-5 w-5" />
              <span>Intelligence data submitted successfully</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
