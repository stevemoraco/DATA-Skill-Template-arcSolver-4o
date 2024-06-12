// SkillDefModal.tsx
import React, { useState, useEffect, FC } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/Index.module.css'; // Import your stylesheet
import Modal from 'react-modal';
import axios from 'axios';


interface SkillDefModalProps {
  isOpen: boolean;
  skillDef: any;
  skillName: string;
  position: { top: number; left: number }; // Position to display the modal
  onRequestClose: () => void;
  setDraftMessage: (message: string) => void;
  setActiveCommand: (activeCommand: string) => void;

}

const SkillDefModal: React.FC<SkillDefModalProps> = ({ isOpen, skillDef, skillName, position, onRequestClose, setDraftMessage, setActiveCommand }) => {

 const [showSourceCode, setShowSourceCode] = useState(false);
 const [customizationInstructions, setCustomizationInstructions] = useState('');
 const [sourceCode, setSourceCode] = useState(null);



 console.log('opening skillDef: ', skillDef);
 if (!skillDef) return null;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={styles.reactModalOverlay}
      className={`${styles.reactModalContent} ${styles.adjustGoalsModalContent}`}
    >
      <div className={styles.modalScrollableContent}>
        {/* <button onClick={onRequestClose} className={styles.closeButton}>Close</button> */}

        <h2 className={styles.modalHeader}>{skillDef.emoji} {skillDef.displayName}</h2>
         <ReactMarkdown className={styles.modalField}>{`**Cost**: ${skillDef.sotaEstimatedCost} USD | **Time**: ${skillDef.estimatedRunTime} | **Reliability**: ${skillDef.reliabilityRatio * 100}% | **Concurrency**: ${skillDef.maxConcurrency}`}</ReactMarkdown>

        <ReactMarkdown className={styles.modalField}>{`**Version**: ${skillDef.skillVersion}`}</ReactMarkdown>
         <ReactMarkdown className={styles.modalField}>{`${skillDef.description}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Default Model**: ${skillDef.model}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Recommended Model(s)**: (use these or better)`}</ReactMarkdown>
        <div className={styles.modalTags}>
          {skillDef.recommendedModels.map((models: string) => (
            <span key={models} className={styles.modalTag}>{models}</span>
          ))}
        </div>
        <ReactMarkdown className={styles.modalField}>{`**This Command Uses These Other Commands**:`}</ReactMarkdown>
        <div className={styles.modalTags}>
          {skillDef.dependencies.map((dependency: string) => (
            <span key={dependency} className={styles.modalTag}>{dependency}</span>
          ))}
          </div>
        <ReactMarkdown className={styles.modalField}>{`**Max Number of This Command That Can Be Run At Once**:\n${skillDef.maxConcurrency}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Estimated Run Time**:\n${skillDef.estimatedRunTime}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Reliability & Cost**:\n${skillDef.reliability}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Fact Checking**:\n${skillDef.factChecking}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Known Issues**:\n${skillDef.knownIssues}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Roadmap**:\n${skillDef.roadmap}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Author**:\n${skillDef.author}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Donate**:\n[${skillDef.donateLink}](${skillDef.donateLink})`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Contact Support**:\n[${skillDef.supportUrl}](${skillDef.supportUrl})`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Follow the Author**:\n[${skillDef.socialHandle}](${skillDef.socialHandle})`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Learn More**:\n[${skillDef.promoUrl}](${skillDef.promoUrl})`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Published**:\n${skillDef.createdAt}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Updated**:\n${skillDef.updatedAt}`}</ReactMarkdown>
        <ReactMarkdown className={styles.modalField}>{`**Keywords**:`}</ReactMarkdown>
        <div className={styles.modalTags}>
          {skillDef.keywords.map((keyword: string) => (
            <span key={keyword} className={styles.modalTag}>{keyword}</span>
          ))}
        </div>
        <ReactMarkdown className={styles.modalField}>{`**Walkthrough**:\n${skillDef?.walkthrough}`}</ReactMarkdown>
       
        </div>
        <p className={styles.grey}>Scroll for more.</p>
   
        <button onClick={onRequestClose} className={styles.modalButton}>
          Close
        </button>
      </Modal>
  );
};

export default SkillDefModal;
