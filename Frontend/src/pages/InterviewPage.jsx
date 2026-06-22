import React, { useState } from "react";
import SetUp1 from "../components/SetUp1";
import Interview2 from "../components/Interview2";
import Report3 from "../components/Report3";

function InterviewPage() {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50">
      {step === 1 && (
        <SetUp1
          onStart={(data) => {
            setInterviewData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Interview2
          interviewData={interviewData}
          onFinish={(report) => {
            setInterviewData(report);
            setStep(3);
          }}
        />
      )}
      {step === 3 && <Report3 report={interviewData} />}
    </div>
  );
}

export default InterviewPage;
