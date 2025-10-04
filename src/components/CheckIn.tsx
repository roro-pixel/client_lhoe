import React, { useState } from "react";
import { Clock } from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CheckIn = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_CHECKIN}/appointment/checkin?email=${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ clientEmail: email })
      });

      if (response.ok) {
        toast.success("Check in réussi!");
      } else {
        toast.error("Check in non réussi!");
      }
    } catch (error) {
      toast.error("Erreur dans le check in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <Clock className="w-12 h-12 text-blue-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Présence Rendez-vous</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="appointmentId" className="text-gray-700 text-lg font-medium block mb-2">
              Entrer
            </label>
            <input
              id="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
              placeholder="Votre mail"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? "Validation en cours..." : "Confirmer ma présence"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckIn;