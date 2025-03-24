import { useState } from 'react'
import styled from '@emotion/styled'
import Building from './components/Building'
import LiftControls from './components/LiftControls'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 0.75rem;
  gap: 1rem;

  @media (min-width: 1200px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem;
    gap: 2rem;
  }
`

const BuildingSection = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    max-width: 400px;
    gap: 1rem;
  }
`

const ConfigPanel = styled.div`
  background-color: white;
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;

  @media (min-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const ConfigInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 50px;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    padding: 0.5rem 0.75rem;
    width: 60px;
    font-size: 1rem;
  }
`;

const ConfigLabel = styled.label`
  font-size: 0.875rem;
  color: #2c3e50;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  @media (min-width: 1200px) {
    flex-direction: row;
    flex-wrap: nowrap;
    width: auto;
    gap: 2rem;
  }
`;

interface LiftState {
  id: number;
  currentFloor: number;
  direction: 'up' | 'down' | null;
  isMoving: boolean;
  requestQueue: number[];
}

function App() {
  const MIN_FLOORS = 5;
  const [totalFloors, setTotalFloors] = useState(8);
  const numberOfLifts = 2;
  const ANIMATION_DURATION = 9000;
  
  const [lifts, setLifts] = useState<LiftState[]>(() => 
    Array.from({ length: numberOfLifts }, (_, index) => ({
      id: index + 1,
      currentFloor: 1,
      direction: null,
      isMoving: false,
      requestQueue: []
    }))
  );

  const handleFloorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= MIN_FLOORS) {
      setTotalFloors(value);
    }
  };

  const findNearestAvailableLift = (targetFloor: number) => {
    let nearestLift = lifts[0];
    let shortestDistance = Math.abs(targetFloor - lifts[0].currentFloor);

    lifts.forEach(lift => {
      if (lift.requestQueue.length === 0) {
        const distance = Math.abs(targetFloor - lift.currentFloor);
        if (distance < shortestDistance && !lift.isMoving) {
          shortestDistance = distance;
          nearestLift = lift;
        }
      }
    });

    return nearestLift;
  };

  const processNextRequest = (liftId: number) => {
    setLifts(prevLifts => {
      const lift = prevLifts.find(l => l.id === liftId);
      if (!lift || lift.requestQueue.length === 0) return prevLifts;

      const nextFloor = lift.requestQueue[0];
      const newQueue = lift.requestQueue.slice(1);

      return prevLifts.map(l => 
        l.id === liftId
          ? {
              ...l,
              currentFloor: nextFloor,
              direction: nextFloor > l.currentFloor ? 'up' : 'down',
              isMoving: true,
              requestQueue: newQueue
            }
          : l
      );
    });

    setTimeout(() => {
      setLifts(prevLifts => {
        const updatedLift = prevLifts.find(l => l.id === liftId);
        if (!updatedLift) return prevLifts;

        const newState = {
          ...updatedLift,
          isMoving: false,
          direction: null
        };

        if (updatedLift.requestQueue.length > 0) {
          processNextRequest(liftId);
        }

        return prevLifts.map(l => l.id === liftId ? newState : l);
      });
    }, ANIMATION_DURATION);
  };

  const handleFloorRequest = (floor: number) => {
    setLifts(prevLifts => {
      const nearestLift = findNearestAvailableLift(floor);
      
      return prevLifts.map(lift => {
        if (lift.id === nearestLift.id) {
          const newQueue = [...lift.requestQueue, floor];
          
          if (!lift.isMoving && lift.requestQueue.length === 0) {
            setTimeout(() => processNextRequest(lift.id), 0);
          }
          
          return {
            ...lift,
            requestQueue: newQueue
          };
        }
        return lift;
      });
    });
  };

  return (
    <AppContainer>
      <BuildingSection>
        <ConfigPanel>
          <ConfigLabel>Number of Floors:</ConfigLabel>
          <ConfigInput 
            type="number" 
            min={MIN_FLOORS}
            value={totalFloors}
            onChange={handleFloorsChange}
          />
        </ConfigPanel>
        <Building 
          totalFloors={totalFloors} 
          lifts={lifts}
        />
      </BuildingSection>
      <ControlsContainer>
        <LiftControls 
          totalFloors={totalFloors}
          lifts={lifts}
          onFloorSelect={handleFloorRequest}
        />
        <LiftControls 
          totalFloors={totalFloors}
          lifts={lifts}
          onFloorSelect={handleFloorRequest}
        />
      </ControlsContainer>
    </AppContainer>
  );
}

export default App
