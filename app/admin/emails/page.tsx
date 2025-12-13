"use client";

import { useState, useEffect } from "react";
import { Send, Loader2, CheckCircle2, XCircle, Eye, X, Search } from "lucide-react";
import type { EmailTemplateType } from "@/lib/email-templates";

interface User {
  id: string;
  email: string;
  clerk_user_id: string;
  created_at: string;
  updated_at: string;
}

interface EmailTemplate {
  id: EmailTemplateType;
  name: string;
  description: string;
  subject: string;
  html: string;
  variables: string[];
}

export default function AdminEmailsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType | "custom">("custom");
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const replaceVariables = (template: string, vars: Record<string, string>): string => {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      result = result.replace(regex, value || "");
    }
    return result;
  };

  useEffect(() => {
    document.title = "Send Emails - Admin Panel - SimpleResu.me";
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate !== "custom" && templates.length > 0) {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (template) {
        setEmailSubject(template.subject);
        setEmailContent(template.html);
        // Initialize variables with empty strings
        setTemplateVariables((prev) => {
          const vars: Record<string, string> = {};
          template.variables.forEach((v) => {
            vars[v] = prev[v] || "";
          });
          return vars;
        });
      }
    } else if (selectedTemplate === "custom") {
      // Clear template variables when switching to custom
      setTemplateVariables({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate, templates]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/email-templates", {
        method: "GET",
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const selectAllUsers = (filteredUsersList: User[]) => {
    const filteredIds = filteredUsersList.map((u) => u.id);
    const allFilteredSelected = filteredIds.every((id) => selectedUsers.has(id));
    
    if (allFilteredSelected) {
      // Deselect all filtered users
      const newSelection = new Set(selectedUsers);
      filteredIds.forEach((id) => newSelection.delete(id));
      setSelectedUsers(newSelection);
    } else {
      // Select all filtered users
      const newSelection = new Set(selectedUsers);
      filteredIds.forEach((id) => newSelection.add(id));
      setSelectedUsers(newSelection);
    }
  };

  const getPreviewContent = (): string => {
    let content = emailContent;
    if (selectedTemplate !== "custom") {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (template) {
        content = template.html;
      }
    }
    // Replace variables for preview (use sample data)
    const previewVars = {
      ...templateVariables,
      name: templateVariables.name || "John Doe",
      email: templateVariables.email || "john@example.com",
    };
    return replaceVariables(content, previewVars);
  };

  const getPreviewSubject = (): string => {
    let subject = emailSubject;
    if (selectedTemplate !== "custom") {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (template) {
        subject = template.subject;
      }
    }
    // Replace variables for preview
    const previewVars = {
      ...templateVariables,
      name: templateVariables.name || "John Doe",
      email: templateVariables.email || "john@example.com",
    };
    return replaceVariables(subject, previewVars);
  };

  const sendBulkEmail = async () => {
    // Get the base content and subject (from template or custom)
    let baseSubject = emailSubject;
    let baseContent = emailContent;

    if (selectedTemplate !== "custom") {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (template) {
        baseSubject = template.subject;
        baseContent = template.html;
      }
    }

    if (!baseSubject || !baseContent) {
      setEmailStatus({
        type: "error",
        message: "Please fill in both subject and content",
      });
      return;
    }

    if (selectedUsers.size === 0) {
      setEmailStatus({
        type: "error",
        message: "Please select at least one user",
      });
      return;
    }

    setSendingEmail(true);
    setEmailStatus(null);

    try {
      // For each user, replace {name} and {email} variables
      const userIds = Array.from(selectedUsers);
      const selectedUsersData = users.filter((u) => userIds.includes(u.id));

      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const user of selectedUsersData) {
        // Replace user-specific variables
        const userVars = {
          ...templateVariables,
          name: user.email.split("@")[0] || "there",
          email: user.email,
        };

        const finalSubject = replaceVariables(baseSubject, userVars);
        const finalContent = replaceVariables(baseContent, userVars);

        const response = await fetch("/api/admin/send-email", {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({
            userIds: [user.id],
            subject: finalSubject,
            content: finalContent,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          sent++;
        } else {
          failed++;
          errors.push(`${user.email}: ${data.error || "Failed"}`);
        }
      }

      setEmailStatus({
        type: "success",
        message: `Successfully sent ${sent} email(s). ${failed > 0 ? `${failed} failed.` : ""}`,
      });

      if (sent > 0) {
        setEmailSubject("");
        setEmailContent("");
        setSelectedUsers(new Set());
        setTemplateVariables({});
        setSelectedTemplate("custom");
      }
    } catch {
      setEmailStatus({
        type: "error",
        message: "An error occurred while sending emails",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Send Emails</h1>
        <p className="text-gray-600 mt-1">
          Send bulk or targeted emails to users using templates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Email Composer - Left Side (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Compose Email</h2>
            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          <div className="space-y-4">
            {/* Selected Users Summary */}
            {selectedUsers.size > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="text-sm font-medium text-emerald-900 mb-2">
                  {selectedUsers.size} user{selectedUsers.size !== 1 ? "s" : ""} selected
                </div>
                <div className="flex flex-wrap gap-2">
                  {users
                    .filter((u) => selectedUsers.has(u.id))
                    .slice(0, 5)
                    .map((user) => (
                      <span
                        key={user.id}
                        className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded"
                      >
                        {user.email}
                      </span>
                    ))}
                  {selectedUsers.size > 5 && (
                    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                      +{selectedUsers.size - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Template Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Email Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => setSelectedTemplate("custom")}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTemplate === "custom"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-gray-900">Custom HTML</div>
                  <div className="text-xs text-gray-500 mt-1">Write your own HTML email</div>
                </button>
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTemplate === template.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
              {selectedTemplate !== "custom" && currentTemplate && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="text-sm font-medium text-emerald-900">
                    Selected: {currentTemplate.name}
                  </div>
                  <div className="text-xs text-emerald-700 mt-1">
                    {currentTemplate.variables.length > 0
                      ? `Variables: ${currentTemplate.variables.join(", ")}`
                      : "No variables required"}
                  </div>
                </div>
              )}
            </div>

            {/* Template Variables */}
            {selectedTemplate !== "custom" && currentTemplate && currentTemplate.variables.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Template Variables
                </h3>
                <div className="space-y-3">
                  {currentTemplate.variables.map((variable) => (
                    <div key={variable}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {variable}
                      </label>
                      <input
                        type="text"
                        value={templateVariables[variable] || ""}
                        onChange={(e) =>
                          setTemplateVariables({
                            ...templateVariables,
                            [variable]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder={`Enter ${variable}...`}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Note: {"{name}"} and {"{email}"} will be automatically replaced for each user
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (HTML)
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={16}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                placeholder="Enter HTML email content or use a template..."
              />
            </div>

            {emailStatus && (
              <div
                className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
                  emailStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {emailStatus.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {emailStatus.message}
              </div>
            )}

            <button
              onClick={sendBulkEmail}
              disabled={sendingEmail || selectedUsers.size === 0}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors font-medium disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to {selectedUsers.size} user(s)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Users List - Right Side (1/3 width) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Users</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search users by email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-600">
                {selectedUsers.size} of {users.length} selected
              </span>
              <button
                onClick={() => selectAllUsers(filteredUsers)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {filteredUsers.every((u) => selectedUsers.has(u.id)) ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {userSearchQuery ? (
                  <>No users found matching &quot;{userSearchQuery}&quot;</>
                ) : (
                  <>No users available</>
                )}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedUsers.has(user.id)
                      ? "bg-emerald-50 border-emerald-200"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Email Preview</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Preview how your email will look
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="text-xs text-gray-500 font-medium mb-1">Subject:</div>
                <div className="text-lg font-semibold text-gray-900">
                  {getPreviewSubject() || "No subject"}
                </div>
              </div>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: getPreviewContent() || "<p class='text-gray-400'>No content to preview</p>" }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
