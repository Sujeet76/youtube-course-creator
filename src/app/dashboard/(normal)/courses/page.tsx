import { getEnrolledCourses } from "@/feature/enrolled-course/action";
import EnrolledCourseCard from "@/feature/enrolled-course/components/enrolled-course-card";

export default async function Page() {
  const res = await getEnrolledCourses();

  if (!res.success) {
    return <div>{res.message}</div>;
  }

  return (
    <div className="container">
      <div className="mb-4 text-2xl font-semibold">
        <h1>Enrolled Courses</h1>
      </div>

      <ul className="grid grid-cols-1 gap-x-4 gap-y-2.5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(5_,_auto)]">
        {res.data.map((item) => (
          <EnrolledCourseCard
            key={item.id}
            lastAccessedVideo={item.lastAccessedVideoId ?? ""}
            course={item.course}
          />
        ))}
      </ul>
    </div>
  );
}
