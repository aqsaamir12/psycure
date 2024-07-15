import React, { useEffect } from 'react';

function VoiceFlowChat() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      window.voiceflow.chat.load({
        verify: { projectID: '666754d18437329a9eb8bae0' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production'
      });
    };
    script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return <></>; // You can return null since this component doesn't render anything visible
}

export default VoiceFlowChat;
