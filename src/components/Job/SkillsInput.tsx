import { useEffect, useMemo, useState } from "react";
import Fuse, { IFuseOptions } from "fuse.js";
import MultipleSelector from "../ui/MultiSelect";
import { Skeleton } from "../ui/skeleton";

interface Skill {
  id: number;
  skill: string;
}

interface SkillsInputProps {
  field: any;
  form: any;
  skills: Skill[]; // ➝ Skills now come as a prop
  isLoading?: boolean; // Optional loading flag
}

const SkillsInput = ({ field, form, skills, isLoading = false }: SkillsInputProps) => {
  const [query, setQuery] = useState<string>("");

  const fuseOptions: IFuseOptions<Skill> = {
    keys: ["skill"],
    threshold: 0.3,
  };

  const fuse = useMemo(() => new Fuse(skills || [], fuseOptions), [skills]);

  const results = useMemo((): Skill[] => {
    if (!query) return skills || [];
    return fuse.search(query).map((result) => result.item);
  }, [fuse, query, skills]);

  useEffect(() => {
    const arr = form.getValues("skills") || [];
    field.onChange([...arr]);
    field.value = form.getValues("skills") || [];
  }, [skills]);

  return (
    <div>
      {isLoading ? (
        <Skeleton className="h-9 w-full" />
      ) : (
        <MultipleSelector
          onSearch={(e) => setQuery(e)}
          field={field}
          placeholder="Search Skills"
          options={results.slice(0, 6).map((skill) => ({
            value: skill.skill,
            label: skill.skill,
          }))}
        />
      )}
    </div>
  );
};

export default SkillsInput;
