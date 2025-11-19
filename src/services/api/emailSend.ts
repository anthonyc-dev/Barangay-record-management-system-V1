import emailjs from "@emailjs/browser";

/**
 * Configuration interface for EmailJS service
 */
interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

/**
 * Email template parameters interface
 */
interface EmailParams {
  to_email: string;
  resident_name: string;
  reference_id: string;
  document_type?: string;
  pickup_location?: string;
  amount: string;
  [key: string]: string | undefined; // Allow additional custom parameters
}

/**
 * Response interface for email sending operations
 */
interface EmailResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

/**
 * Default EmailJS configuration
 * Note: These should be moved to environment variables in production
 */
const DEFAULT_CONFIG: EmailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
};

/**
 * Initialize EmailJS with public key
 * Call this once in your app initialization
 */
export const initEmailJS = (publicKey?: string): void => {
  const key = publicKey || DEFAULT_CONFIG.publicKey;

  if (!key) {
    console.warn(
      "EmailJS: Public key not provided. Please set VITE_EMAILJS_PUBLIC_KEY environment variable."
    );
    return;
  }

  emailjs.init(key);
};

/**
 * Send email using EmailJS
 *
 * @param params - Email parameters object
 * @param config - Optional custom EmailJS configuration
 * @returns Promise<EmailResponse>
 */
export const sendEmail = async (
  params: EmailParams,
  config?: Partial<EmailConfig>
): Promise<EmailResponse> => {
  try {
    // Validate required configuration
    const emailConfig = { ...DEFAULT_CONFIG, ...config };

    if (!emailConfig.serviceId || !emailConfig.templateId) {
      throw new Error(
        "EmailJS configuration incomplete. Please check your environment variables."
      );
    }

    // Validate required parameters
    if (!params.to_email || !params.resident_name || !params.reference_id) {
      throw new Error(
        "Required email parameters missing: to_email, resident_name, and reference_id are required."
      );
    }

    // Send email via EmailJS
    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      params,
      emailConfig.publicKey
    );

    return {
      success: true,
      message: "Email sent successfully!",
      data: response,
    };
  } catch (error: unknown) {
    console.error("Email sending failed:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      success: false,
      message: "Failed to send email. Please try again later.",
      error: errorMessage,
    };
  }
};

/**
 * Send contact form email with predefined template
 * Convenience function for common contact form use case
 *
 * @param contactData - Contact form data
 * @returns Promise<EmailResponse>
 */
export const sendContactEmail = async (contactData: {
  to_email: string;
  resident_name: string;
  reference_id: string;
  document_type?: string;
  pickup_location?: string;
  amount: string;
}): Promise<EmailResponse> => {
  const emailParams: EmailParams = {
    to_email: contactData.to_email,
    resident_name: contactData.resident_name,
    reference_id: contactData.reference_id,
    document_type: contactData.document_type,
    pickup_location: contactData.pickup_location,
    amount: contactData.amount,
  };

  return sendEmail(emailParams);
};

/**
 * Utility function to validate email format
 *
 * @param email - Email address to validate
 * @returns boolean
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if EmailJS is properly configured
 *
 * @returns boolean
 */
export const isEmailJSConfigured = (): boolean => {
  return !!(
    DEFAULT_CONFIG.serviceId &&
    DEFAULT_CONFIG.templateId &&
    DEFAULT_CONFIG.publicKey
  );
};

// Initialize EmailJS on module load
initEmailJS();
