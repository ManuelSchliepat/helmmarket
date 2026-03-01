'use client';
import { useEffect, useState } from 'react';
import { useDnD } from './DnDContext';

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export default function SkillArsenal({ connectedSkillIds }: { connectedSkillIds: string[] }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [, setType] = useDnD();

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(Array.isArray(data) ? data : data.skills || []));
  }, []);

  const onDragStart = (event: React.DragEvent, skill: Skill) => {
    setType(skill.id);
    event.dataTransfer.setData('application/helmskill', JSON.stringify(skill));
    event.dataTransfer.effectAllowed = 'move';
  };

  const available = skills.filter(s => !connectedSkillIds.includes(s.id));

  return (
    <div className="skill-arsenal">
      <div className="arsenal-header">
        <span className="arsenal-title">⚔️ SKILL ARSENAL</span>
        <span className="arsenal-count">{available.length} available</span>
      </div>
      <div className="arsenal-grid">
        {available.map(skill => (
          <div
            key={skill.id}
            className="arsenal-card"
            draggable
            onDragStart={(e) => onDragStart(e, skill)}
          >
            <span className="arsenal-icon">{skill.icon || '⚡'}</span>
            <span className="arsenal-name">{skill.name}</span>
          </div>
        ))}
        {available.length === 0 && (
          <div className="arsenal-empty">
            All skills connected — or browse the Marketplace for more.
          </div>
        )}
      </div>
    </div>
  );
}
