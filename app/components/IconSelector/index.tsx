import { Grid, IconButton } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';


interface IconSelectorProps {
  icons: Record<string, IconType>;
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ icons, selectedIcon, onIconSelect }) => {
    const filteredIcons = Object.entries(icons)?.filter(([key]) => !['envelope', 'globe', 'phone'].includes(key));

    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {filteredIcons?.map(([key, IconComponent]) => (
                <IconButton
                    key={key}
                    aria-label={key}
                    icon={<IconComponent />}
                    variant={selectedIcon === key ? 'solid' : 'outline'}
                    colorScheme={selectedIcon === key ? 'blue' : 'gray'}
                    onClick={() => onIconSelect(key)}
                    isRound
                />
            ))}
        </Grid>
    );
};

export default IconSelector;
