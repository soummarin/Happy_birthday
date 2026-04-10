"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Upload, Music } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../lib/supabase";

export default function CreateWishPage() {
  const [formData, setFormData] = useState({
    receiverName: "",
    age: 18,
    message: "Wishing you a very happy and fun-filled birthday! ✨",
    musicType: "preset", // 'preset' or 'upload'
    presetMusic: "happy_birthday_classic",
  });
  
  const [musicFile, setMusicFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      let finalMusicUrl = formData.musicType === "preset" 
         ? `/audio/${formData.presetMusic}.mp3` 
         : null;

      // 1. Handle Music Upload if chosen
      if (formData.musicType === "upload" && musicFile) {
        const fileExt = musicFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        // Upload to Supabase bucket 'blowwish'
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("blowwish")
          .upload(`music/${fileName}`, musicFile);
          
        if (uploadError) {
           console.error("Upload error", uploadError);
           throw new Error("Impossible d'uploader la musique. Vérifie que Supabase Storage est bien configuré.");
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from("blowwish")
          .getPublicUrl(`music/${fileName}`);
          
        finalMusicUrl = publicUrl;
      }

      // 2. Save Wish to Database
      // Create record in Supabase
      const { data: wishData, error: dbError } = await supabase
        .from("wishes")
        .insert([{
           creator_name: "Anonymous", // You can add a field for this later
           birthday_name: formData.receiverName,
           age: formData.age,
           ai_message: formData.message,
           music_url: finalMusicUrl
        }])
        .select()
        .single();

      if (dbError) {
         console.warn("DB Error, falling back to URL parameters:", dbError);
         // Fallback logic if Supabase isn't configured yet
         const fallbackUrl = `${window.location.origin}/wish/fallback?name=${encodeURIComponent(formData.receiverName)}&age=${formData.age}&msg=${encodeURIComponent(formData.message)}`;
         setLink(fallbackUrl);
      } else {
         // Success
         const successUrl = `${window.location.origin}/wish/${wishData.id}`;
         setLink(successUrl);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur s'est produite lors de la génération.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="orb orb-purple w-[60vh] h-[60vh] top-[-10%] left-[-10%]" />
      <div className="noise" />
      
      <main className="z-10 w-full max-w-lg glass p-8">
        <h1 className="text-3xl font-display text-white mb-6 text-center">Create a Magic Wish ✨</h1>
        
        {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-6">
                {error}
            </div>
        )}

        {!link ? (
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-white/80 font-semibold mb-2">Birthday Person's Name</label>
              <input 
                type="text" 
                required
                className="input-field" 
                placeholder="e.g. Sarah"
                value={formData.receiverName}
                onChange={(e) => setFormData({...formData, receiverName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-white/80 font-semibold mb-2">Number of Candles (Age)</label>
              <input 
                type="number" 
                min="1" max="100"
                required
                className="input-field" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-white/80 font-semibold mb-2">Personal Message</label>
              <textarea 
                className="input-field resize-none h-24" 
                placeholder="Type a nice message..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
              <label className="block text-white/80 font-semibold mb-2">Background Music</label>
              
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-white/90">
                    <input 
                      type="radio" 
                      name="musicType" 
                      checked={formData.musicType === "preset"}
                      onChange={() => setFormData({...formData, musicType: "preset"})}
                    /> Preset
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white/90">
                    <input 
                      type="radio" 
                      name="musicType" 
                      checked={formData.musicType === "upload"}
                      onChange={() => setFormData({...formData, musicType: "upload"})}
                    /> Upload File
                </label>
              </div>

              {formData.musicType === "preset" ? (
                <select 
                  className="input-field bg-[#2a2045]"
                  value={formData.presetMusic}
                  onChange={(e) => setFormData({...formData, presetMusic: e.target.value})}
                >
                  <option value="happy_birthday_classic">Classic Happy Birthday</option>
                  <option value="lofi_chill">Lo-Fi Chill Vibes</option>
                  <option value="party_up">Party Up!</option>
                </select>
              ) : (
                <div className="relative">
                  <input 
                    type="file" 
                    accept="audio/*"
                    onChange={(e) => setMusicFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-3 input-field border-dashed border-white/30 text-white/60 hover:text-white/90 transition-colors">
                     <Upload size={20} />
                     <span className="truncate">{musicFile ? musicFile.name : "Choose an audio file (MP3, WAV)..."}</span>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-4">
              {isSubmitting ? "Generating Web Magic..." : "✨ Generate Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} />
            </div>
            <h2 className="text-2xl text-white font-bold">Link Generated!</h2>
            <p className="text-white/60">Send this link to {formData.receiverName}:</p>
            
            <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/10">
              <input 
                type="text" 
                readOnly 
                value={link} 
                className="bg-transparent text-white/80 w-full outline-none text-sm"
              />
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                title="Copy link"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-white/80" />}
              </button>
            </div>

            <div className="pt-6 flex gap-4">
              <button onClick={() => {setLink(""); setMusicFile(null);}} className="btn-secondary flex-1">
                Create Another
              </button>
              <Link href={link.replace(typeof window !== "undefined" ? window.location.origin : "", "")} className="btn-primary flex-1">
                Test It!
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
