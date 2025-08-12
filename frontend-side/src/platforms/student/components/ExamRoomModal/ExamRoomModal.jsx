import React from "react";
import ComingSoon from "../../../../components/comingSoon/ComingSoon";
import ExamRoom from "../../../../components/ExamRoom";
 function ExamRoomModal({ onClose }) {
  return (
    <div className="exam-modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">×</button>
        {/* <ComingSoon /> */}
        <ExamRoom />
      </div>
    </div>
  );
}

export default ExamRoomModal;
