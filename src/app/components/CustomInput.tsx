"use client";
import { useState, forwardRef } from "react";
import {
  Eye,
  EyeOff,
  Search,
  Mail,
  Lock,
  User,
  Calendar,
  Phone,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

interface CustomInputProps {
  type?: "text" | "email" | "password" | "search" | "tel" | "url";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  icon?:
    | "search"
    | "mail"
    | "lock"
    | "user"
    | "calendar"
    | "phone"
    | "map-pin"
    | "none";
  className?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      type = "text",
      placeholder,
      value,
      onChange,
      label,
      error,
      icon = "none",
      className = "",
      disabled = false,
      required = false,
      autoComplete,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const getIcon = () => {
      switch (icon) {
        case "search":
          return <Search className="w-4 h-4 text-gray-400" />;
        case "mail":
          return <Mail className="w-4 h-4 text-gray-400" />;
        case "lock":
          return <Lock className="w-4 h-4 text-gray-400" />;
        case "user":
          return <User className="w-4 h-4 text-gray-400" />;
        case "calendar":
          return <Calendar className="w-4 h-4 text-gray-400" />;
        case "phone":
          return <Phone className="w-4 h-4 text-gray-400" />;
        case "map-pin":
          return <MapPin className="w-4 h-4 text-gray-400" />;
        default:
          return null;
      }
    };

    const inputType = type === "password" && showPassword ? "text" : type;
    const hasIcon = icon !== "none";

    return (
      <div className={`relative ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {hasIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              {getIcon()}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`w-full transition-all duration-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasIcon ? "pl-10" : "pl-4"
            } pr-4 py-3 bg-gray-800/50 border rounded-lg ${
              disabled
                ? "opacity-50 cursor-not-allowed border-gray-600"
                : error
                  ? "border-red-500 bg-red-500/10"
                  : isFocused
                    ? "border-blue-500 bg-gray-800"
                    : "border-gray-700 hover:border-gray-600"
            }`}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1 flex items-center"
          >
            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
