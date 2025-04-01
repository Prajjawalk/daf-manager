import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface WireInstructions {
  receivingBank: {
    name: string;
    abaRoutingNumber: string;
  };
}

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundId: string;
}

export function DonationModal({ isOpen, onClose, fundId }: DonationModalProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [wireInstructions, setWireInstructions] =
    useState<WireInstructions | null>(null);
  const [donationId, setDonationId] = useState("");

  const fetchWireInstructions = async () => {
    try {
      const response = await fetch("/api/get-wire-instructions", {
        credentials: "include",
      });
      const data = await response.json();
      setWireInstructions(data);
      setStep(2);
    } catch (error) {
      console.error("Error fetching wire instructions:", error);
    }
  };

  const handleDonation = async () => {
    try {
      const response = await fetch("/api/wire-donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: parseFloat(amount),
          fundId,
        }),
      });
      const data = await response.json();
      setDonationId(data.id);
      setStep(3);
    } catch (error) {
      console.error("Error processing donation:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Donate to DAF</h2>
            <p>Please enter the amount you would like to donate:</p>
            <Input
              type="number"
              placeholder="Amount in USD"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={fetchWireInstructions}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && wireInstructions && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Wire Instructions</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>Please wire your donation to the following account:</p>
              <p className="mt-2">
                <strong>Bank:</strong> {wireInstructions.receivingBank.name}
              </p>
              <p>
                <strong>Routing Number:</strong>{" "}
                {wireInstructions.receivingBank.abaRoutingNumber}
              </p>
            </div>
            <Button onClick={handleDonation} className="w-full">
              I have Completed the Wire Transfer
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Donation Successful!</h2>
            <p>Your donation has been successfully processed.</p>
            <p className="text-sm text-gray-600">Donation ID: {donationId}</p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
