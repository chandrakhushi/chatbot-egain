import random
import re
import time
from datetime import datetime, timedelta

def greet():
    print("\n" + "=" * 50)
    print("👋 Hi! I'm your package assistant bot.")
    print("📦 I can help you track your package or assist with delivery issues.")
    print("💡 You can type 'bye' or 'exit' anytime to end the chat.")
    print("=" * 50 + "\n")

def simulate_typing(text):
    """Simulates typing effect for a more realistic chat experience"""
    print("Bot is typing...", end="\r")
    time.sleep(1)  # Simulate thinking time
    print(" " * 20, end="\r")  # Clear the typing message
    print(f"🤖 {text}")

def ask_tracking_number():
    while True:
        tracking = input("\n🔍 Please enter your tracking number (e.g., TRK123456): ").strip()
        if tracking.lower() in ["bye", "exit", "quit", "end"]:
            exit_chat()
        elif tracking.lower() in ["i don't know", "idk", "lost", "don't know", "unknown"]:
            simulate_typing("No worries. To locate your package, I'll need some additional information.")
            return alternative_lookup()
        elif not validate_tracking_number(tracking):
            simulate_typing("That doesn't look like a valid tracking number. Our tracking numbers typically start with 'TRK' followed by 6-10 digits (e.g., TRK123456).")
        else:
            return tracking.upper()

def validate_tracking_number(tracking):
    """Validates tracking number format"""
    return bool(re.match(r'^trk[a-z0-9]{6,10}$', tracking, re.IGNORECASE))

def alternative_lookup():
    """Handles the case when user doesn't know their tracking number"""
    simulate_typing("Please provide your order number or the email address used for the purchase.")
    
    while True:
        identifier = input("📝 Order number or email: ").strip()
        
        if identifier.lower() in ["bye", "exit", "quit", "end"]:
            exit_chat()
        
        # Check if it's an email or order number format
        if re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', identifier) or re.match(r'^[A-Z0-9]{8,12}$', identifier, re.IGNORECASE):
            simulate_typing(f"Searching for packages associated with {identifier}...")
            time.sleep(1.5)  # Simulate search time
            
            simulate_typing("I found 2 recent shipments:")
            print("   1. TRK789012 (Shipped April 1)")
            print("   2. TRK345678 (Shipped March 28)")
            
            while True:
                choice = input("\nWhich one would you like to track? Please type 1 or 2: ").strip()
                if choice == "1":
                    return "TRK789012"
                elif choice == "2":
                    return "TRK345678"
                else:
                    simulate_typing("Please select either 1 or 2 to choose which shipment to track.")
        else:
            simulate_typing("I couldn't recognize that as an order number or email. Please try again with a valid order number (e.g., ORD12345678) or email address.")

def get_package_status(tracking_number):
    """Returns a random package status with detailed information"""
    statuses = ["Delivered", "In Transit", "Lost"]
    status = random.choice(statuses)
    
    details = {
        "Delivered": {
            "message": "📬 Your package has been delivered on April 3rd at 2:15 PM.",
            "details": "It was signed for by J. Smith."
        },
        "In Transit": {
            "message": "🚚 Your package is currently in transit.",
            "details": "Last scanned in Chicago distribution center. Estimated delivery: April 7th."
        },
        "Lost": {
            "message": "😞 We're having trouble locating your package.",
            "details": "Our team is investigating. You can file a claim for compensation."
        }
    }
    
    return status, details[status]

def generate_delivery_updates():
    """Generates a realistic delivery timeline"""
    current_date = datetime.now()
    updates = []
    
    for days_ago in range(4, -1, -1):
        date = current_date - timedelta(days=days_ago)
        formatted_date = date.strftime("%b %d, %I:%M %p")
        
        if days_ago == 4:
            updates.append(f"{formatted_date} - Package received at shipping facility (New York)")
        elif days_ago == 3:
            updates.append(f"{formatted_date} - Package departed shipping facility")
        elif days_ago == 2:
            updates.append(f"{formatted_date} - Package arrived at sorting center (Chicago)")
        elif days_ago == 1:
            updates.append(f"{formatted_date} - Package in transit to destination")
        else:
            updates.append(f"{formatted_date} - Package out for delivery")
    
    return updates

def handle_status(tracking_number):
    """Displays package status with detailed information"""
    status, details = get_package_status(tracking_number)
    
    simulate_typing(f"📦 Tracking {tracking_number} status: {status}")
    time.sleep(0.8)
    simulate_typing(details["message"])
    time.sleep(0.8)
    simulate_typing(details["details"])
    
    return status

def next_steps(tracking_number, status):
    """Handles the next steps based on package status"""
    time.sleep(0.8)
    simulate_typing("\nWhat would you like to do next?")
    print("1. File a claim")
    print("2. Get email updates")
    print("3. Talk to a human agent")
    print("4. View delivery details")
    
    while True:
        choice = input("\nType 1, 2, 3, or 4: ").strip().lower()

        if choice in ["bye", "exit", "quit", "end"]:
            exit_chat()
        elif choice == "1":
            file_claim(tracking_number)
            break
        elif choice == "2":
            get_email_updates()
            break
        elif choice == "3":
            talk_to_human()
            break
        elif choice == "4":
            view_delivery_details()
            break
        else:
            simulate_typing("❓ Not a valid choice. Please enter 1, 2, 3, or 4.")

def file_claim(tracking_number):
    """Handles the claim filing process"""
    simulate_typing("I'll help you file a claim for your package.")
    
    while True:
        description = input("\n📝 Please describe the issue with your package in a few sentences: ").strip()
        
        if len(description) < 10:
            simulate_typing("⚠️ Please provide more details about the issue so we can process your claim properly.")
        else:
            claim_number = f"CLM{random.randint(100000, 999999)}"
            simulate_typing("✅ Thank you for the information. Your claim has been filed successfully.")
            time.sleep(0.8)
            simulate_typing(f"Claim reference number: {claim_number}")
            time.sleep(0.8)
            simulate_typing("You'll receive an email confirmation within 24 hours, and our team will review your claim within 3-5 business days.")
            break

def get_email_updates():
    """Handles email subscription for package updates"""
    while True:
        email = input("\n📧 Enter your email address: ").strip()
        
        if email.lower() in ["bye", "exit", "quit", "end"]:
            exit_chat()
        elif not validate_email(email):
            simulate_typing("⚠️ That doesn't seem like a valid email address. Please enter a valid email (e.g., name@example.com).")
        else:
            simulate_typing(f"👍 Great! Updates for your package will be sent to {email}")
            time.sleep(0.8)
            simulate_typing("You'll receive notifications when there are changes to your package status.")
            break

def validate_email(email):
    """Validates email format"""
    return bool(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email))

def talk_to_human():
    """Handles human agent connection"""
    simulate_typing("👨‍💻 I'm connecting you to a human agent. Please wait a moment...")
    time.sleep(1.5)
    case_number = f"CS{random.randint(10000, 99999)}"
    simulate_typing(f"A customer service representative will be with you shortly. Your case number is #{case_number}.")

def view_delivery_details():
    """Shows detailed delivery timeline"""
    simulate_typing("📋 Here are the detailed delivery updates for your package:")
    updates = generate_delivery_updates()
    for update in updates:
        print(f"   {update}")

def exit_chat():
    """Exits the chat with a farewell message"""
    simulate_typing("\n👋 Thanks for chatting with me. Have a great day!")
    exit()

def final_options():
    """Presents final options to the user"""
    time.sleep(0.8)
    simulate_typing("\nIs there anything else I can help you with today?")
    print("1. Track another package")
    print("2. End chat")
    
    while True:
        choice = input("\nType 1 or 2: ").strip().lower()
        
        if choice in ["1", "track", "another", "yes"]:
            return True
        elif choice in ["2", "end", "no", "bye", "exit", "quit"]:
            return False
        else:
            simulate_typing("I didn't understand that. Would you like to track another package or end our chat?")

def main():
    greet()
    
    while True:
        tracking_number = ask_tracking_number()
        simulate_typing(f"Thank you! Let me look up information for {tracking_number}...")
        time.sleep(1)  # Simulate lookup time
        
        status = handle_status(tracking_number)
        next_steps(tracking_number, status)
        
        if not final_options():
            exit_chat()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nChat ended by user. Goodbye!")
    except Exception as e:
        print(f"\n\nAn error occurred: {e}")
        print("Please restart the chatbot.")

