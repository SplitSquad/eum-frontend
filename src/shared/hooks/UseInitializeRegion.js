import { useEffect } from 'react';
import { useRegionStore } from '@/features/community/store/regionStore';
import { getInitialRegion } from '@/shared/utils/RegionUtils';
const UseInitializeRegion = () => {
    const setRegionState = useRegionStore.setState;
    useEffect(() => {
        const initial = getInitialRegion();
        setRegionState({ ...initial });
    }, []);
};
export default UseInitializeRegion;
