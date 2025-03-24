import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface LiftState {
  id: number;
  currentFloor: number;
  direction: 'up' | 'down' | null;
  isMoving: boolean;
}

interface BuildingProps {
  totalFloors: number;
  lifts: LiftState[];
}

const BuildingContainer = styled.div`
  width: 300px;
  background-color: #2c3e50;
  position: relative;
  display: flex;
`;

const FloorsContainer = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Floor = styled.div`
  height: 80px;
  background-color: #e74c3c;
  border-bottom: 2px solid #2c3e50;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 10px;
  gap: 10px;
  position: relative;
`;

const FloorNumber = styled.div`
  position: absolute;
  right: 10px;
  top: 5px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  z-index: 1;
`;

const Window = styled.div`
  width: 60%;
  background-color: #fff;
  opacity: 0.3;
  border-radius: 4px;
`;

const LiftShaft = styled.div`
  flex: 1;
  background-color: #2c3e50;
  position: relative;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
`;

const LiftCar = styled(motion.div)`
  width: 90%;
  height: 70px;
  background-color: #95a5a6;
  position: absolute;
  left: 5%;
  border-radius: 4px;
  border: 2px solid #7f8c8d;
`;

const LiftNumber = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const Building = ({ totalFloors, lifts }: BuildingProps) => {
  return (
    <BuildingContainer>
      <FloorsContainer>
        {[...Array(totalFloors)].reverse().map((_, index) => (
          <Floor key={index}>
            <FloorNumber>
              {totalFloors - index === 1 ? 'G' : totalFloors - index}
            </FloorNumber>
            <Window />
            <Window />
            <Window />
            <Window />
          </Floor>
        ))}
      </FloorsContainer>
      <LiftShaft>
        {lifts.map((lift) => (
          <LiftCar
            key={lift.id}
            initial={false}
            animate={{
              bottom: `${(lift.currentFloor - 1) * 82}px`,
            }}
            transition={{
              type: "spring",
              duration: 8,
              stiffness: 30,
              damping: 25,
              mass: 3
            }}
          >
            <LiftNumber>{lift.id}</LiftNumber>
          </LiftCar>
        ))}
      </LiftShaft>
    </BuildingContainer>
  );
};

export default Building; 