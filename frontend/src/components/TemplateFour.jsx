import React, { useEffect, useRef, useState } from "react";
import { LuMail, LuPhone, LuGithub, LuGlobe, LuMapPin, LuUser } from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";
import {
  EducationInfo,
  WorkExperience,
  ProjectInfo,
  CertificationInfo,
} from "./ResumeSection";
import { formatYearMonth } from "../utils/helper";
import { colorThemes } from "../utils/data";

const DEFAULT_THEME = ["#ffffff", "#1e40af", "#3b82f6", "#60a5fa", "#dbeafe"];

const Title = ({ text, color, theme }) => (
  <div className="relative w-fit mb-3 resume-section-title">
    <h2
      className="relative text-lg font-bold uppercase tracking-wide pb-2"
      style={{ color: color || theme?.primary || '#1e40af' }}
    >
      {text}
    </h2>
    <div
      className="w-full h-[3px] mt-1 rounded-full"
      style={{ backgroundColor: color || theme?.primary || '#1e40af' }}
    />
  </div>
);

const TemplateFour = ({ resumeData = {}, colorPalette, containerWidth, colorTheme, themeKey }) => {
  const resumeRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [baseWidth, setBaseWidth] = useState(794);

  const {
    profileInfo = {},
    contactInfo = {},
    workExperience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    interests = [],
    additionalInfo = {}
  } = resumeData;

  // Get theme colors
  const theme = colorTheme || {
    background: colorPalette?.[0] || DEFAULT_THEME[0],
    primary: colorPalette?.[1] || DEFAULT_THEME[1],
    secondary: colorPalette?.[2] || DEFAULT_THEME[2],
    accent: colorPalette?.[3] || DEFAULT_THEME[3],
    light: colorPalette?.[4] || DEFAULT_THEME[4],
    text: '#1f2937'
  };

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualWidth);
      setScale(containerWidth / actualWidth);
    }
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className="bg-white font-sans max-w-full overflow-hidden"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "210mm",
        minHeight: "297mm",
        maxWidth: "210mm",
        backgroundColor: theme.background,
        color: theme.text,
        wordWrap: "break-word",
        overflowWrap: "break-word",
      }}
    >
      {/* Header Section with Photo */}
      <div 
        className="relative p-8 text-white"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="flex items-start gap-6">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            {profileInfo.profilePhoto ? (
              <img
                src={profileInfo.profilePhoto}
                alt={profileInfo.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                <LuUser size={48} className="text-white/70" />
              </div>
            )}
          </div>

          {/* Name and Title */}
          <div className="flex-1 pt-4">
            <h1 className="text-4xl font-bold mb-2">
              {profileInfo.fullName}
            </h1>
            <h2 className="text-xl font-medium mb-4 opacity-90">
              {profileInfo.designation}
            </h2>
            
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {contactInfo.email && (
                <div className="flex items-center gap-2">
                  <LuMail size={16} />
                  <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo.phone && (
                <div className="flex items-center gap-2">
                  <LuPhone size={16} />
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.location && (
                <div className="flex items-center gap-2">
                  <LuMapPin size={16} />
                  <span>{contactInfo.location}</span>
                </div>
              )}
              {contactInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <RiLinkedinLine size={16} />
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    LinkedIn
                  </a>
                </div>
              )}
              {contactInfo.github && (
                <div className="flex items-center gap-2">
                  <LuGithub size={16} />
                  <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    GitHub
                  </a>
                </div>
              )}
              {contactInfo.website && (
                <div className="flex items-center gap-2">
                  <LuGlobe size={16} />
                  <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Professional Summary */}
        {profileInfo.summary && (
          <div className="mb-8">
            <Title text="Professional Summary" theme={theme} />
            <p className="text-sm leading-relaxed text-justify break-words hyphens-auto max-w-full overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: '1.6' }}>
              {profileInfo.summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Work Experience */}
            {workExperience.length > 0 && (
              <div>
                <Title text="Professional Experience" theme={theme} />
                <div className="space-y-4">
                  {workExperience.map((exp, index) => (
                    <WorkExperience
                      key={index}
                      experience={exp}
                      theme={theme}
                      className="border-l-2 pl-4"
                      style={{ borderColor: theme.light }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <Title text="Key Projects" theme={theme} />
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <ProjectInfo
                      key={index}
                      project={project}
                      theme={theme}
                      className="border-l-2 pl-4"
                      style={{ borderColor: theme.light }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <Title text="Core Skills" theme={theme} />
                <div className="space-y-2">
                  {skills.map((skill, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: theme.secondary,
                            width: `${skill.level || 80}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <Title text="Education" theme={theme} />
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <EducationInfo
                      key={index}
                      education={edu}
                      theme={theme}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <Title text="Certifications" theme={theme} />
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <CertificationInfo
                      key={index}
                      certification={cert}
                      theme={theme}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <Title text="Languages" theme={theme} />
                <div className="space-y-1">
                  {languages.map((lang, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm">{lang.name}</span>
                      <span className="text-xs text-gray-600">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div>
                <Title text="Interests" theme={theme} />
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, i) =>
                    interest ? (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: theme.light,
                          color: theme.primary
                        }}
                      >
                        {interest}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFour;
