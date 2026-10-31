import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/screen";
import {
  PageSkeleton,
  SkeletonFooter,
  type SkeletonPage,
} from "../../components/page-skeleton";

/** Local preview only: render any skeleton at /skeleton-preview?page=profile. */
export default function SkeletonPreview() {
  const { page = "home" } = useLocalSearchParams<{ page?: string }>();
  const footer = page === "home" ? <SkeletonFooter /> : page === "sessions" ? <SkeletonFooter secondary /> : undefined;
  return (
    <Screen footer={footer}>
      <PageSkeleton page={page as SkeletonPage} />
    </Screen>
  );
}
