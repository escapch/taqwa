import { Container } from '@/components/shared/container';
import { PrayerTimesDisplay } from '@/components/shared/services/prayer-time/prayer-times-display';

export default function PrayerTimePage() {
    return (
        <div className="py-8">
            <Container>
                <PrayerTimesDisplay />
            </Container>
        </div>
    );
}
