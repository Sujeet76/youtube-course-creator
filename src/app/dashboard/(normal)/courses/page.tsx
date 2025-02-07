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

      <ul className="grid grid-cols-3 gap-4">
        {res.data.map((item) => (
          <li key={item.id}>
            <EnrolledCourseCard
              lastAccessedVideo={item.lastAccessedVideoId ?? ""}
              course={item.course}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
