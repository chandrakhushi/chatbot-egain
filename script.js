let step = 0
let trackingNumber = ""
const chatBox = document.getElementById("chat-box")

// Add package status descriptions for more realistic responses
const packageStatuses = {
  Delivered: {
    message: "📬 Your package has been delivered on April 3rd at 2:15 PM.",
    details: "It was signed for by J. Smith.",
  },
  "In Transit": {
    message: "🚚 Your package is currently in transit.",
    details: "Last scanned in Chicago distribution center. Estimated delivery: April 7th.",
  },
  Lost: {
    message: "😞 We're having trouble locating your package.",
    details: "Our team is investigating. You can file a claim for compensation.",
  },
}

function handleUserInput() {
  const inputField = document.getElementById("user-input")
  const userInput = inputField.value.trim()
  if (!userInput) return

  addMessage(userInput, "user")
  inputField.value = ""

  setTimeout(() => processInput(userInput), 500)
}

function addMessage(text, sender) {
  const message = document.createElement("div")
  message.className = sender
  message.innerText = text
  chatBox.appendChild(message)
  chatBox.scrollTop = chatBox.scrollHeight
}

function showTyping(callback) {
  const typingMsg = document.createElement("div")
  typingMsg.className = "bot typing"
  typingMsg.innerText = "Bot is typing..."
  chatBox.appendChild(typingMsg)
  chatBox.scrollTop = chatBox.scrollHeight

  setTimeout(() => {
    typingMsg.remove()
    callback()
  }, 1000)
}

function processInput(input) {
  input = input.toLowerCase()

  if (step !== -1) {
    showTyping(() => {
      // Handle exit commands at any step
      if (["bye", "exit", "end", "quit"].includes(input)) {
        addMessage("👋 Thanks for chatting! Have a great day!", "bot")
        step = -1
        setTimeout(() => {
          showTyping(() => {
            addMessage("Would you like to track another package? Type 'yes' to start over.", "bot")
            step = -2 // Special state for restart prompt
          })
        }, 800)
        return
      }

      // Handle restart from exit state
      if (step === -2 && ["yes", "y", "yeah", "sure", "ok"].includes(input)) {
        restartChat()
        return
      }

      // Initial tracking number input
      if (step === 1) {
        if (["i don't know", "idk", "lost", "don't know", "unknown"].includes(input)) {
          addMessage("😕 No worries. To locate your package, I'll need some additional information.", "bot")
          setTimeout(() => {
            showTyping(() => {
              addMessage("Please provide your order number or the email address used for the purchase.", "bot")
              step = 5 // Special step for alternative lookup
            })
          }, 800)
          return
        } else if (!validateTrackingNumber(input)) {
          addMessage(
            "⚠️ That doesn't look like a valid tracking number. Our tracking numbers typically start with 'TRK' followed by 6-10 digits (e.g., TRK123456).",
            "bot",
          )
          return
        }

        trackingNumber = input.toUpperCase()
        const status = getRandomStatus()
        const statusDetails = packageStatuses[status]

        addMessage(`📦 Tracking ${trackingNumber} status: ${status}`, "bot")

        setTimeout(() => {
          showTyping(() => {
            addMessage(statusDetails.message, "bot")
            setTimeout(() => {
              showTyping(() => {
                addMessage(statusDetails.details, "bot")
                step++
                setTimeout(() => {
                  showTyping(() => {
                    addMessage(
                      "What would you like to do next?\n1. File a claim\n2. Get email updates\n3. Talk to a human agent\n4. View delivery details",
                      "bot",
                    )
                    step++
                  })
                }, 800)
              })
            }, 800)
          })
        }, 800)
        return
      }

      // Alternative lookup flow
      if (step === 5) {
        if (validateEmail(input) || input.match(/^[A-Z0-9]{8,12}$/i)) {
          addMessage(`🔍 Searching for packages associated with ${input}...`, "bot")
          setTimeout(() => {
            showTyping(() => {
              addMessage("I found 2 recent shipments:", "bot")
              setTimeout(() => {
                showTyping(() => {
                  addMessage("1. TRK789012 (Shipped April 1)\n2. TRK345678 (Shipped March 28)", "bot")
                  setTimeout(() => {
                    showTyping(() => {
                      addMessage("Which one would you like to track? Please type 1 or 2.", "bot")
                      step = 6 // Waiting for shipment selection
                    })
                  }, 800)
                })
              }, 800)
            })
          }, 1200)
          return
        } else {
          addMessage(
            "⚠️ I couldn't recognize that as an order number or email. Please try again with a valid order number (e.g., ORD12345678) or email address.",
            "bot",
          )
          return
        }
      }

      // Handle shipment selection from alternative lookup
      if (step === 6) {
        if (input === "1" || input === "2") {
          const selectedTracking = input === "1" ? "TRK789012" : "TRK345678"
          trackingNumber = selectedTracking
          addMessage(`📦 You selected ${selectedTracking}. Let me get that information for you.`, "bot")

          const status = getRandomStatus()
          const statusDetails = packageStatuses[status]

          setTimeout(() => {
            showTyping(() => {
              addMessage(`Status: ${status}`, "bot")
              setTimeout(() => {
                showTyping(() => {
                  addMessage(statusDetails.message, "bot")
                  setTimeout(() => {
                    showTyping(() => {
                      addMessage(statusDetails.details, "bot")
                      step = 3 // Move to next steps options
                      setTimeout(() => {
                        showTyping(() => {
                          addMessage(
                            "What would you like to do next?\n1. File a claim\n2. Get email updates\n3. Talk to a human agent\n4. View delivery details",
                            "bot",
                          )
                        })
                      }, 800)
                    })
                  }, 800)
                })
              }, 800)
            })
          }, 800)
          return
        } else {
          addMessage("❓ Please select either 1 or 2 to choose which shipment to track.", "bot")
          return
        }
      }

      // Handle next steps options
      if (step === 3) {
        if (input === "1") {
          addMessage("✅ I'll help you file a claim for your package.", "bot")
          setTimeout(() => {
            showTyping(() => {
              addMessage("Please describe the issue with your package in a few sentences.", "bot")
              step = 7 // Claim description step
            })
          }, 800)
        } else if (input === "2") {
          addMessage("📧 Please enter your email address to receive updates.", "bot")
          step = 4 // Email input step
          return
        } else if (input === "3") {
          addMessage("👨‍💻 I'm connecting you to a human agent. Please wait a moment...", "bot")
          setTimeout(() => {
            showTyping(() => {
              addMessage(
                "A customer service representative will be with you shortly. Your case number is #CS" +
                  Math.floor(10000 + Math.random() * 90000) +
                  ".",
                "bot",
              )
              step = -1 // End conversation
              setTimeout(() => {
                showTyping(() => {
                  addMessage("Would you like to track another package while you wait? Type 'yes' to start over.", "bot")
                  step = -2 // Special state for restart prompt
                })
              }, 1000)
            })
          }, 1500)
        } else if (input === "4") {
          addMessage("📋 Here are the detailed delivery updates for your package:", "bot")
          setTimeout(() => {
            showTyping(() => {
              const updates = generateDeliveryUpdates(trackingNumber)
              addMessage(updates, "bot")
              setTimeout(() => {
                showTyping(() => {
                  addMessage(
                    "What would you like to do next?\n1. File a claim\n2. Get email updates\n3. Talk to a human agent",
                    "bot",
                  )
                })
              }, 1000)
            })
          }, 1000)
        } else {
          addMessage("❓ That wasn't a valid choice. Please enter 1, 2, 3, or 4.", "bot")
        }
      } else if (step === 4) {
        if (validateEmail(input)) {
          addMessage(`👍 Great! Updates for ${trackingNumber} will be sent to ${input}`, "bot")
          setTimeout(() => {
            showTyping(() => {
              addMessage("You'll receive notifications when there are changes to your package status.", "bot")
              setTimeout(() => {
                showTyping(() => {
                  addMessage(
                    "Is there anything else I can help you with today?\n1. Track another package\n2. File a claim\n3. End chat",
                    "bot",
                  )
                  step = 8 // Final options
                })
              }, 800)
            })
          }, 800)
        } else {
          addMessage(
            "⚠️ That doesn't seem like a valid email address. Please enter a valid email (e.g., name@example.com).",
            "bot",
          )
          return
        }
      } else if (step === 7) {
        // Handle claim description
        if (input.length < 10) {
          addMessage("⚠️ Please provide more details about the issue so we can process your claim properly.", "bot")
          return
        }

        addMessage("✅ Thank you for the information. Your claim has been filed successfully.", "bot")
        setTimeout(() => {
          showTyping(() => {
            addMessage(`Claim reference number: CLM${Math.floor(100000 + Math.random() * 900000)}`, "bot")
            setTimeout(() => {
              showTyping(() => {
                addMessage(
                  "You'll receive an email confirmation within 24 hours, and our team will review your claim within 3-5 business days.",
                  "bot",
                )
                setTimeout(() => {
                  showTyping(() => {
                    addMessage(
                      "Is there anything else I can help you with today?\n1. Track another package\n2. End chat",
                      "bot",
                    )
                    step = 8 // Final options
                  })
                }, 800)
              })
            }, 800)
          })
        }, 800)
      } else if (step === 8) {
        // Handle final options
        if (input === "1" || input.toLowerCase().includes("track") || input.toLowerCase().includes("another")) {
          restartChat()
        } else if (
          input === "2" ||
          input === "3" ||
          input.toLowerCase().includes("end") ||
          input.toLowerCase().includes("bye")
        ) {
          addMessage("👋 Thanks for chatting! Have a great day!", "bot")
          step = -1
        } else {
          addMessage("I didn't understand that. Would you like to track another package or end our chat?", "bot")
        }
      }
    })
  } else if (step === -2 && ["yes", "y", "yeah", "sure", "ok"].includes(input.toLowerCase())) {
    // Handle restart from special restart state
    restartChat()
  }
}

function validateTrackingNumber(input) {
  // Accept TRK followed by 6-10 alphanumeric characters
  return /^trk[a-z0-9]{6,10}$/i.test(input)
}

function getRandomStatus() {
  const statuses = Object.keys(packageStatuses)
  return statuses[Math.floor(Math.random() * statuses.length)]
}

function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email)
}

function generateDeliveryUpdates(trackingNumber) {
  const currentDate = new Date()
  const updates = [
    `${formatDate(subtractDays(currentDate, 4))} - Package received at shipping facility (New York)`,
    `${formatDate(subtractDays(currentDate, 3))} - Package departed shipping facility`,
    `${formatDate(subtractDays(currentDate, 2))} - Package arrived at sorting center (Chicago)`,
    `${formatDate(subtractDays(currentDate, 1))} - Package in transit to destination`,
    `${formatDate(currentDate)} - Package out for delivery`,
  ]

  return updates.join("\n")
}

function formatDate(date) {
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
  )
}

function subtractDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

function restartChat() {
  chatBox.innerHTML = ""
  step = 1
  trackingNumber = ""
  addMessage("👋 Hi! I'm your package assistant bot.", "bot")
  setTimeout(() => {
    showTyping(() => {
      addMessage("📦 I can help you track your package or assist with delivery issues.", "bot")
      setTimeout(() => {
        showTyping(() => {
          addMessage(
            "Please enter your tracking number (e.g., TRK123456).\nIf you don't know it, just type 'I don't know'.",
            "bot",
          )
        })
      }, 600)
    })
  }, 600)
}

document.getElementById("user-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleUserInput()
  }
})

const toggleBtn = document.getElementById("toggle-theme")
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark")
  })
}

window.onload = () => {
  addMessage("👋 Hi! I'm your package assistant bot.", "bot")
  setTimeout(() => {
    showTyping(() => {
      addMessage("📦 I can help you track your package or assist with delivery issues.", "bot")
      setTimeout(() => {
        showTyping(() => {
          addMessage(
            "Please enter your tracking number (e.g., TRK123456).\nIf you don't know it, just type 'I don't know'.",
            "bot",
          )
        })
      }, 600)
    })
  }, 600)
  step = 1
}

