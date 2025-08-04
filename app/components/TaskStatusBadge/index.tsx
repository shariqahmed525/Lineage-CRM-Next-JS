import { Badge } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { TaskStatus } from '../../../types/databaseTypes';

const TaskStatusBadge = ({ taskStatusId }: { taskStatusId: string }) => {
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);

  useEffect(() => {
    fetch('/api/getTaskStatuses')
      .then(response => response.json())
      .then((statuses: TaskStatus[]) => {
        setTaskStatuses(statuses);
      });
  }, []);

  useEffect(() => {
    const foundStatus = taskStatuses?.find(
      (status) => status.status_id === taskStatusId
    );
    setSelectedStatus(foundStatus || null);
  }, [taskStatuses, taskStatusId]);

  return (
    <Badge
      colorScheme="green"
      textColor="white"
      bg={selectedStatus?.badge_color_hexcode || 'gray.200'}
    >
      {selectedStatus ? selectedStatus.status_name : 'Unknown Status'}
    </Badge>
  );
};

export default TaskStatusBadge;
