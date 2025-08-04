import { Tooltip, Icon } from '@chakra-ui/react';
import { 
  FaEnvelope, FaGlobe, FaPhone, FaFacebook, FaTwitter, 
  FaLinkedin, FaInstagram, FaYoutube, FaNewspaper, FaTv, 
  FaBullhorn, FaBuilding, FaHospital, FaUniversity, FaChurch, 
  FaPlane, FaCar, FaChartPie 
} from 'react-icons/fa';

import { Tables, TablesInsert } from '@/types/types';

import ErrorBoundary from '../ErrorBoundary'; // Adjust the import path as necessary

// Import all the icons as in LeadSourceComponent.tsx

const ICONS = {
  envelope: FaEnvelope,
  globe: FaGlobe,
  phone: FaPhone,
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  youtube: FaYoutube,
  newspaper: FaNewspaper,
  television: FaTv,
  megaphone: FaBullhorn,
  building: FaBuilding,
  hospital: FaHospital,
  university: FaUniversity,
  church: FaChurch,
  airplane: FaPlane,
  car: FaCar,
  chart: FaChartPie,
};

type IconName = keyof typeof ICONS;

interface LeadSourceIconProps {
  leadSourceId: string;
  leadSources: TablesInsert<'lead_sources'>[];
}

const LeadSourceIcon: React.FC<LeadSourceIconProps> = ({ leadSourceId, leadSources }) => {
  const leadSource = leadSources?.find(source => source.id === leadSourceId);

  if (!leadSource) {
    return null;
  }

  const iconName = leadSource.icon as IconName;
  const IconComponent = ICONS[iconName];

  return (
    <ErrorBoundary>
      <Tooltip label={leadSource.name} aria-label={`Lead source: ${leadSource.name}`} zIndex={1}>
        <span style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Icon as={IconComponent} boxSize="1.2em" color="#0C2115" opacity="0.5" zIndex={1} />
        </span>
      </Tooltip>
    </ErrorBoundary>
  );
};

export default LeadSourceIcon;