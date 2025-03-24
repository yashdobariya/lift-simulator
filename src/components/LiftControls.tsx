import styled from '@emotion/styled';

interface LiftState {
  id: number;
  currentFloor: number;
  direction: 'up' | 'down' | null;
  isMoving: boolean;
  requestQueue: number[];
}

interface LiftControlsProps {
  totalFloors: number;
  lifts: LiftState[];
  onFloorSelect: (floor: number) => void;
}

const ControlPanel = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 320px;

  @media (min-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
    width: 280px;
  }
`;

const DisplaySection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  justify-content: center;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const LiftDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 120px;

  @media (min-width: 768px) {
    width: 100%;
  }
`;

const LiftLabel = styled.div`
  font-size: 0.875rem;
  color: #7f8c8d;
  font-weight: 500;
`;

const CurrentFloor = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DirectionLabel = styled.div`
  font-size: 0.75rem;
  color: #7f8c8d;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  width: 100%;
  justify-items: center;
  padding: 0.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const FloorButton = styled.button<{ isQueued: boolean }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.isQueued ? '#e74c3c' : '#f8f9fa'};
  color: ${props => props.isQueued ? 'white' : '#2c3e50'};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    width: 3.5rem;
    height: 3.5rem;
    font-size: 1.25rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    background-color: ${props => props.isQueued ? '#c0392b' : '#e0e0e0'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const LiftControls = ({ totalFloors, lifts, onFloorSelect }: LiftControlsProps) => {
  const isFloorQueued = (floor: number) => {
    return lifts.some(lift => 
      lift.currentFloor === floor || 
      lift.requestQueue.includes(floor)
    );
  };

  const floorNumbers = Array.from({ length: totalFloors }, (_, i) => totalFloors - i);
  
  const columns = Array.from({ length: 4 }, (_, i) => 
    floorNumbers.filter((_, index) => index % 4 === i)
  );

  return (
    <ControlPanel>
      <DisplaySection>
        {lifts.map(lift => (
          <LiftDisplay key={lift.id}>
            <LiftLabel>Lift {lift.id}</LiftLabel>
            <CurrentFloor>
              {lift.currentFloor === 1 ? 'G' : lift.currentFloor}
            </CurrentFloor>
            <DirectionLabel>
              {lift.direction === 'up' ? '↑ Up' : lift.direction === 'down' ? '↓ Down' : 'Idle'}
            </DirectionLabel>
          </LiftDisplay>
        ))}
      </DisplaySection>
      <ButtonsContainer>
        {columns.map((column) => 
          column.map(floor => (
            <FloorButton
              key={floor}
              isQueued={isFloorQueued(floor)}
              onClick={() => onFloorSelect(floor)}
            >
              {floor === 1 ? 'G' : floor}
            </FloorButton>
          ))
        )}
      </ButtonsContainer>
    </ControlPanel>
  );
};

export default LiftControls; 