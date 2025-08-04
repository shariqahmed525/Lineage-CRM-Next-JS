/**
 * A simple wrapper of the Chakra Tooltip around a question mark
 * icon that takes in a tooltip message and passes any other props
 * to the Chakra Tooltip. Note: When wrapping an icon from react-icons,
 * the icon is also wrapped in a span element as react-icons icons do not use forwardRef.
 */
import { Tooltip } from '@chakra-ui/react';
import { FaRegQuestionCircle } from 'react-icons/fa';

interface ExplanationTooltipProps {
  message: string;
  [key: string]: any;
}

const ExplanationTooltip: React.FC<ExplanationTooltipProps> = ({ message, ...props }) => {
  return (
    <Tooltip label={message} size={"lg"} {...props}>
      <span>
        <FaRegQuestionCircle size={25}/>
      </span>
    </Tooltip>
  );
}

export default ExplanationTooltip