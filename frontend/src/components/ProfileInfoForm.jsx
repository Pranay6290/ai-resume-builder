import React from "react";
import {Input} from "./Inputs"; // ✅ adjust this path if your Input is elsewhere
import { profileInfoStyles } from "../assets/dummystyle"; // ✅ adjust if styles are in a different file

const ProfileInfoForm = ({ profileData, updateSection }) => {
  return (
    <div className={profileInfoStyles.container}>
      <h2 className={profileInfoStyles.heading}>Personal Information</h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={profileData.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
          />

          <Input
            label="Designation"
            placeholder="Full Stack Developer"
            value={profileData.designation || ""}
            onChange={({ target }) => updateSection("designation", target.value)}
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Summary
            </label>
            <textarea
              className={profileInfoStyles.textarea}
              rows={4}
              placeholder="Short introduction about yourself"
              value={profileData.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoForm;
