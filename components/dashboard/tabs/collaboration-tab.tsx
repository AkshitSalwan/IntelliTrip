'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Share2, Copy, Trash2, Plus, Lock, Eye, Edit, Link as LinkIcon } from 'lucide-react';

interface Collaborator {
  id: string;
  email: string;
  role: 'viewer' | 'editor' | 'owner';
  joinedDate: string;
}

interface CollaborationTabProps {
  trip: any;
}

export function CollaborationTab({ trip }: CollaborationTabProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(trip.collaborators || []);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor'>('viewer');
  const [shareLink, setShareLink] = useState(
    `${typeof window !== 'undefined' ? window.location.origin : ''}/trips/${trip._id}/shared`
  );
  const [copied, setCopied] = useState(false);

  const handleInviteCollaborator = () => {
    if (!inviteEmail.trim()) return;

    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      email: inviteEmail,
      role: inviteRole,
      joinedDate: new Date().toLocaleDateString(),
    };

    setCollaborators([...collaborators, newCollaborator]);
    setInviteEmail('');
    setShowInviteForm(false);
  };

  const handleChangeRole = (id: string, newRole: 'viewer' | 'editor') => {
    setCollaborators(
      collaborators.map(c =>
        c.id === id ? { ...c, role: newRole } : c
      )
    );
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-teal-200/50 bg-gradient-to-br from-white to-cyan-50/20 p-6">
      {/* Sharing Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Share Trip</h3>
        
        <div className="rounded-lg border border-teal-200/50 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Public Link</p>
              <p className="text-sm text-slate-600">Anyone with this link can view your trip</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={shareLink}
              readOnly
              className="border-teal-200/50 bg-slate-50"
            />
            <Button
              onClick={handleCopyLink}
              size="sm"
              className="btn-gradient"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>

      {/* Collaborators Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Team Members
            </h3>
            <p className="text-sm text-slate-600">{collaborators.length} member{collaborators.length !== 1 ? 's' : ''}</p>
          </div>
          <Button
            onClick={() => {
              setShowInviteForm(!showInviteForm);
              setInviteEmail('');
              setInviteRole('viewer');
            }}
            size="sm"
            className={showInviteForm ? 'border-teal-200/50 bg-white text-teal-700' : 'btn-gradient'}
            variant={showInviteForm ? 'outline' : 'default'}
          >
            <Plus className="mr-2 h-4 w-4" />
            Invite
          </Button>
        </div>

        {/* Invite Form */}
        {showInviteForm && (
          <div className="space-y-3 rounded-xl border border-teal-200/50 bg-cyan-50/30 p-4">
            <Input
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="border-teal-200/50"
            />
            
            <div>
              <label className="text-sm font-medium text-slate-900">Permission Level</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'viewer' | 'editor')}
                className="mt-1 w-full rounded-lg border border-teal-200/50 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="viewer">Viewer (Read-only)</option>
                <option value="editor">Editor (Can edit content)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleInviteCollaborator}
                className="btn-gradient flex-1"
              >
                Send Invite
              </Button>
              <Button
                onClick={() => {
                  setShowInviteForm(false);
                  setInviteEmail('');
                }}
                variant="outline"
                className="border-teal-200/50"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Collaborators List */}
        {collaborators.length === 0 ? (
          <p className="text-center text-slate-500/70 py-8 italic">
            No collaborators yet. Invite someone to join this trip!
          </p>
        ) : (
          <div className="space-y-2">
            {collaborators.map(collaborator => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between rounded-lg border border-teal-200/50 bg-white p-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{collaborator.email}</p>
                  <p className="text-sm text-slate-600">
                    Joined {collaborator.joinedDate} • {collaborator.role === 'owner' ? 'Owner' : collaborator.role === 'editor' ? 'Editor' : 'Viewer'}
                  </p>
                </div>

                {collaborator.role !== 'owner' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={collaborator.role}
                      onChange={(e) => handleChangeRole(collaborator.id, e.target.value as 'viewer' | 'editor')}
                      className="rounded border border-teal-200/50 bg-white px-2 py-1 text-sm text-slate-700"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {collaborator.role === 'owner' && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">Owner</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        
        <div className="space-y-2">
          <div className="rounded-lg border border-teal-200/50 bg-white p-3 text-sm">
            <p className="text-slate-900"><span className="font-medium">You</span> created this trip</p>
            <p className="text-slate-600 text-xs mt-1">Today</p>
          </div>
          
          {collaborators.map(collab => (
            <div key={collab.id} className="rounded-lg border border-teal-200/50 bg-white p-3 text-sm">
              <p className="text-slate-900"><span className="font-medium">{collab.email}</span> joined as {collab.role}</p>
              <p className="text-slate-600 text-xs mt-1">{collab.joinedDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
