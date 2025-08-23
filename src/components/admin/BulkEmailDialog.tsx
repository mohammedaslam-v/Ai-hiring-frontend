import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'react-toastify';
import { Send, Mail, RefreshCw, FileText, Calendar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { BulkEmailDialogProps, EmailTemplate } from '@/types/admin';

const defaultTemplates: EmailTemplate[] = [
  {
    id: "interview-invite",
    name: "Interview Invitation",
    subject: "Invitation for an Interview Session",
    message: "Dear Candidate,\n\nThank you for your application. We are pleased to invite you for an online interview session. Please log in to our portal to schedule your interview at your convenience.\n\nBest regards,\nThe Recruitment Team"
  },
  {
    id: "interview-reminder",
    name: "Interview Reminder",
    subject: "Reminder: Your Scheduled Interview",
    message: "Dear Candidate,\n\nThis is a friendly reminder about your upcoming interview session. Please ensure you log in to our platform 5 minutes before the scheduled time.\n\nBest regards,\nThe Recruitment Team"
  },
  {
    id: "congratulations",
    name: "Congratulations - Passed",
    subject: "Congratulations on Passing Your Interview",
    message: "Dear Candidate,\n\nCongratulations! We are pleased to inform you that you have successfully passed your interview. Our team will contact you soon with the next steps.\n\nBest regards,\nThe Recruitment Team"
  },
  {
    id: "application-update",
    name: "Application Status Update",
    subject: "Update on Your Application Status",
    message: "Dear Candidate,\n\nWe would like to provide you with an update on your application. Your application is currently under review, and we will inform you of any developments soon.\n\nBest regards,\nThe Recruitment Team"
  },
  {
    id: "custom",
    name: "Custom Template",
    subject: "",
    message: ""
  }
];

const BulkEmailDialog = ({
  isOpen,
  onClose,
  applicants,
  filteredApplicants,
  statusFilter,
}: BulkEmailDialogProps) => {
  const [emailFilter, setEmailFilter] = useState(statusFilter !== "all" ? statusFilter : "all");
  const [includeFiltered, setIncludeFiltered] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("interview-invite");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  
  // Auto-select template based on status filter when dialog opens
  useEffect(() => {
    if (statusFilter === "pending") {
      setSelectedTemplate("interview-invite");
    } else if (statusFilter === "in_progress") {
      setSelectedTemplate("interview-reminder");
    } else if (statusFilter === "passed") {
      setSelectedTemplate("congratulations");
    } else {
      setSelectedTemplate("application-update");
    }
    
    // Apply the selected template immediately
    const template = defaultTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      setSubject(template.subject);
      setMessage(template.message);
    }
  }, [statusFilter, isOpen, selectedTemplate]);

  // Apply template when selected
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = defaultTemplates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setMessage(template.message);
    }
  };

  const getRecipients = () => {
    let recipients;
    
    if (includeFiltered) {
      recipients = filteredApplicants;
    } else {
      recipients = applicants.filter((applicant) => {
        // Filter by status
        if (emailFilter !== "all") {
          if (emailFilter === "pending" && applicant.application_status !== "pending") return false;
          if (emailFilter === "in_progress" && applicant.interview_status !== "in_progress") return false;
          if (emailFilter === "completed" && applicant.interview_status !== "completed") return false;
          if (emailFilter === "failed" && applicant.interview_status !== "failed") return false;
          if (emailFilter === "passed" && (applicant.interview_status !== "completed" || (applicant.score || 0) < 60)) return false;
        }
        
        // Filter by score
        if (scoreFilter === "passed" && (applicant.score || 0) < 60) return false;
        if (scoreFilter === "failed" && (applicant.score || 0) >= 60) return false;
        
        // Filter by date range
        if (fromDate) {
          const appDate = new Date(applicant.application_date);
          if (appDate < fromDate) return false;
        }
        
        if (toDate) {
          const appDate = new Date(applicant.application_date);
          // Set time to end of day for toDate for inclusive comparison
          const endOfDay = new Date(toDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (appDate > endOfDay) return false;
        }
        
        return true;
      });
    }

    return recipients;
  };

  const handleSendEmails = () => {
    const recipients = getRecipients();
    
    if (!subject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter an email message");
      return;
    }

    if (recipients.length === 0) {
      toast.error("No recipients match your criteria");
      return;
    }

    // Construction of mailto link with multiple recipients
    try {
      setIsLoading(true);
      
      // We'll use the BCC field for privacy
      const recipientEmails = recipients.map(r => r.email).join(",");
      
      // We need to encode the subject and body for the mailto link
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(message);
      
      // Create the mailto link
      const mailtoLink = `mailto:?bcc=${recipientEmails}&subject=${encodedSubject}&body=${encodedBody}`;
      
      // Open the default email client
      window.location.href = mailtoLink;
      
      toast.success(`Email prepared for ${recipients.length} recipients. Your email client should open automatically.`);
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("Failed to open email client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const recipientCount = getRecipients().length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Mail className="mr-2 h-5 w-5" />
            Send Bulk Email
          </DialogTitle>
          <DialogDescription>
            Send an email to multiple candidates based on their status.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Email Templates */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Select Email Template
            </Label>
            <RadioGroup 
              value={selectedTemplate} 
              onValueChange={handleTemplateChange}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {defaultTemplates.map(template => (
                <div key={template.id} className="flex items-center space-x-2 border rounded-md p-2 hover:bg-slate-50">
                  <RadioGroupItem value={template.id} id={`template-${template.id}`} />
                  <Label htmlFor={`template-${template.id}`} className="flex-grow cursor-pointer">
                    {template.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Email Recipients Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailFilter" className="text-sm font-medium">
                Select Recipients By Status
              </Label>
              <Select value={emailFilter} onValueChange={setEmailFilter}>
                <SelectTrigger id="emailFilter">
                  <SelectValue placeholder="Select status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applicants</SelectItem>
                  <SelectItem value="pending">Pending Applications</SelectItem>
                  <SelectItem value="in_progress">In Interview</SelectItem>
                  <SelectItem value="completed">Completed Interviews</SelectItem>
                  <SelectItem value="failed">Failed Interviews</SelectItem>
                  <SelectItem value="passed">Passed Interviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scoreFilter" className="text-sm font-medium">
                Filter By Result
              </Label>
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger id="scoreFilter">
                  <SelectValue placeholder="Select result filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="passed">Passed (Final Total Score ≥ 60%)</SelectItem>
                  <SelectItem value="failed">Failed (Final Total Score &lt; 60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filter By Application Date</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : <span>From Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : <span>To Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeFiltered"
                checked={includeFiltered}
                onCheckedChange={(checked) => setIncludeFiltered(checked as boolean)}
              />
              <Label htmlFor="includeFiltered" className="text-sm">
                Use current table filters instead (respects search and all filters)
              </Label>
            </div>

            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
              {recipientCount === 0 ? (
                <p className="text-red-500">⚠️ No recipients match your criteria.</p>
              ) : (
                <p>
                  ✉️ This will prepare an email to{" "}
                  <strong>{recipientCount} recipient{recipientCount !== 1 ? "s" : ""}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Email Subject */}
          <div className="space-y-2">
            <Label htmlFor="emailSubject" className="text-sm font-medium">
              Email Subject
            </Label>
            <Input
              id="emailSubject"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Email Message */}
          <div className="space-y-2">
            <Label htmlFor="emailMessage" className="text-sm font-medium">
              Email Message
            </Label>
            <Textarea
              id="emailMessage"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] w-full"
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmails} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || recipientCount === 0}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email to {recipientCount} Recipient{recipientCount !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEmailDialog;
