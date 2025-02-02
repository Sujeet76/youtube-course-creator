import { getPlayListDetails } from "@/action/video";

const Page = async () => {
  const res = await getPlayListDetails();
  return <div>{JSON.stringify(res)}</div>;
};

export default Page;
