// Documentation on event listeners: https://www.twilio.com/docs/voice/sdks/javascript/twiliocall#events
import { useToast } from '@chakra-ui/react';
import { Call } from '@twilio/voice-sdk';
import { useEffect } from 'react';


interface CallEventListenersProps {
  call?: Call | null;
  callStatus: {
    [key: string]: boolean;
  };
  setCallStatus: React.Dispatch<React.SetStateAction<{
    [key: string]: boolean;
  }>>;
}

const CallEventListeners: React.FC<CallEventListenersProps> = ({ call, callStatus, setCallStatus }) => {
  const toast = useToast();

  useEffect(() => {
    const handleAccept = () => {
      setCallStatus(prev => ({
        ...prev, accept: true, inProgress: true, dialing: false,
      }));
      toast({
        title: 'Call accepted',
        description: 'The incoming call was accepted',
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
    };

    const handleAudio = (audioElement: HTMLAudioElement) => {
      setCallStatus({ ...callStatus, audio: true });
      // Handle the audio event here
    };

    const handleCancel = () => {
      setCallStatus(prev => ({ ...prev, cancel: true, dialing: false }));
      toast({
        title: 'Call cancelled',
        description: 'The call has been cancelled.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    };

    const handleDisconnect = () => {
      setCallStatus(prev => ({
        ...prev, disconnect: true, inProgress: false, dialing: false,
      }));
      toast({
        title: 'Call disconnected',
        description: 'The call has been disconnected.',
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
    };

    const handleError = (error: Error) => {
      setCallStatus({ ...callStatus, error: true });
      toast({
        title: 'Error',
        description: `An error has occurred: ${error.message}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    };

    const handleMute = (isMuted: boolean) => {
      setCallStatus({ ...callStatus, mute: isMuted });
      toast({
        title: isMuted ? 'Call is muted' : 'Call is unmuted',
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
      console.log(isMuted ? 'muted' : 'unmuted');
    };

    const handleReconnected = () => {
      setCallStatus({ ...callStatus, reconnected: true });
      console.log('The call has regained connectivity.');
    };

    const handleReconnecting = (error: Error) => {
      setCallStatus({ ...callStatus, reconnecting: true });
      console.log('Connectivity error: ', error.message);
    };

    const handleReject = () => {
      setCallStatus(prev => ({ ...prev, reject: true, dialing: false }));
      console.log('The call was rejected.');
    };

    const handleRinging = (hasEarlyMedia: boolean) => {
      console.log('Ringing!', hasEarlyMedia);
      setCallStatus({ ...callStatus, ringing: true });
    };

    call?.on('accept', handleAccept);
    call?.on('audio', handleAudio);
    call?.on('cancel', handleCancel);
    call?.on('disconnect', handleDisconnect);
    call?.on('error', handleError);
    call?.on('mute', handleMute);
    call?.on('reconnected', handleReconnected);
    call?.on('reconnecting', handleReconnecting);
    call?.on('reject', handleReject);
    call?.on('ringing', handleRinging);

    return () => {
      call?.off('accept', handleAccept);
      call?.off('audio', handleAudio);
      call?.off('cancel', handleCancel);
      call?.off('disconnect', handleDisconnect);
      call?.off('error', handleError);
      call?.off('mute', handleMute);
      call?.off('reconnected', handleReconnected);
      call?.off('reconnecting', handleReconnecting);
      call?.off('reject', handleReject);
      call?.off('ringing', handleRinging);
    };
  }, [call, toast, callStatus, setCallStatus]);

  return <></>;
};

export default CallEventListeners;
