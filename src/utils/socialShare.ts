// Social Media Sharing Utilities

interface JobShareData {
  id: string;
  job_title: string;
  company_name: string;
  job_location?: string;
  job_type: string;
  pay_amount: string;
  job_category?: string;
}

// Get job URL
export const getJobUrl = (jobId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/jobs/${jobId}`;
};

// Format share message
export const formatShareMessage = (job: JobShareData): string => {
  return `🚀 We're Hiring!

Position: ${job.job_title}
Company: ${job.company_name}
${job.job_location ? `Location: ${job.job_location}` : ''}
Type: ${job.job_type}
Salary: ₹${job.pay_amount}

Apply now: ${getJobUrl(job.id)}

#Hiring #Jobs ${job.job_category ? `#${job.job_category.replace(/\s+/g, '')}` : ''}`;
};

// LinkedIn Share
export const shareOnLinkedIn = (job: JobShareData) => {
  const url = getJobUrl(job.id);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=600');
};

// WhatsApp Share (Message/Status)
export const shareOnWhatsApp = (job: JobShareData, isMobile: boolean = false) => {
  const message = formatShareMessage(job);
  const whatsappUrl = isMobile 
    ? `whatsapp://send?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

// Twitter/X Share
export const shareOnTwitter = (job: JobShareData) => {
  const text = `🚀 We're Hiring: ${job.job_title} at ${job.company_name}`;
  const url = getJobUrl(job.id);
  const hashtags = `Hiring,Jobs${job.job_category ? `,${job.job_category.replace(/\s+/g, '')}` : ''}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
  window.open(twitterUrl, '_blank', 'width=600,height=600');
};

// Facebook Share
export const shareOnFacebook = (job: JobShareData) => {
  const url = getJobUrl(job.id);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=600');
};

// Instagram (Copy link - Instagram doesn't support direct sharing via URL)
export const shareOnInstagram = (job: JobShareData) => {
  const url = getJobUrl(job.id);
  const message = `Check out this job opportunity: ${job.job_title} at ${job.company_name}\n\n${url}`;
  
  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).then(() => {
      return { success: true, message: 'Link copied! Open Instagram and paste to share.' };
    });
  }
  return { success: false, message: 'Please copy the link manually' };
};

// Copy Link
export const copyJobLink = (job: JobShareData): Promise<boolean> => {
  const url = getJobUrl(job.id);
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(url).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
};

// Web Share API (Native sharing - works on mobile)
export const shareViaWebAPI = async (job: JobShareData): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${job.job_title} - ${job.company_name}`,
        text: `Check out this job opportunity: ${job.job_title} at ${job.company_name}`,
        url: getJobUrl(job.id),
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
};

// Check if mobile device
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
