"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { JobEditorFormProps } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useFormTriggersStore } from "@/store/useFormTriggersStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Sparkles } from "lucide-react";
import LinkButtonAnimated from "@/components/ui/animated-button-link";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobCategory } from "@/store/useJobCategory";

interface SubCat {
  id: string;
  name: string;
}

const JobDetailsForm = ({
  jobData,
  setJobData,
  currentStep,
}: JobEditorFormProps) => {
  const { setTrigger } = useFormTriggersStore();
  const { category, isLoading } = useJobCategory();

  const mainCategory = useMemo(
    () =>
      category
        ? category.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
          }))
        : [],
    [category]
  );

  const [subCategoryArray, setSubCategoryArray] = useState<SubCat[]>([]);

  const form = useForm({
    defaultValues: {
      experienceLevel: jobData.experienceLevel || "",
      categoryId: jobData.categoryId || "",
      subCategoryId: jobData.subCategoryId || "",
      totalHeads: jobData.totalHeads || "",
    },
  });

  useEffect(() => {
    const selectedCategory = category?.find(
      (cat: any) => cat.id === form.watch("categoryId")
    );
    setSubCategoryArray(selectedCategory?.subcategories || []);
  }, [form.watch("categoryId"), category]);

  useEffect(() => {
    setTrigger(currentStep, form.trigger);
  }, [form.trigger, setTrigger, currentStep]);

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      setJobData({ ...jobData, ...values });
    });
    return unsubscribe;
  }, [form, jobData, setJobData]);

  return (
    <div className="max-w-[75%] mx-auto space-y-6 pt-5">
      <Form {...form}>
        <form className="space-y-5">
          {/* Experience */}
          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Experience Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">No Experience Needed</SelectItem>
                    {[1, 2, 3, 4, 5].map((year) => (
                      <SelectItem key={year} value={`${year}`}>
                        {year}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Category & Sub-category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Main Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Job Category</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-9 w-full" />
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? mainCategory.find((cat) => cat.id === field.value)?.name
                              : "Select Job Category"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-full">
                        <Command>
                          <CommandInput placeholder="Search Job Category..." />
                          <CommandList>
                            <CommandEmpty>No category found</CommandEmpty>
                            <CommandGroup>
                              {mainCategory.map((cat) => (
                                <CommandItem
                                  key={cat.id}
                                  value={cat.name}
                                  onSelect={() => form.setValue("categoryId", cat.id)}
                                >
                                  {cat.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      cat.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </FormItem>
              )}
            />

            {/* Sub Category */}
            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Sub Category</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-9 w-full" />
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={subCategoryArray.length === 0}
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? subCategoryArray.find(
                                  (cat) => cat.id === field.value
                                )?.name
                              : "Select Sub Category"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-full">
                        <Command>
                          <CommandInput placeholder="Search Sub Category..." />
                          <CommandList>
                            <CommandEmpty>No sub-category found</CommandEmpty>
                            <CommandGroup>
                              {subCategoryArray.map((cat) => (
                                <CommandItem
                                  key={cat.id}
                                  value={cat.name}
                                  onSelect={() =>
                                    form.setValue("subCategoryId", cat.id)
                                  }
                                >
                                  {cat.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      cat.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                  <FormDescription>Select the category first</FormDescription>
                </FormItem>
              )}
            />
          </div>

          {/* Total Heads */}
          <FormField
            control={form.control}
            name="totalHeads"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Number of People to Hire</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select openings" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={`${num}`}>
                        {num}
                      </SelectItem>
                    ))}
                    <SelectItem value="5+">5+</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Footer */}
      <div className="text-muted-foreground text-center absolute bottom-3 right-2 flex gap-1 flex-col bg-background w-full">
        <div className="self-end">
          <p className="text-xs">Missing a category?</p>
          <LinkButtonAnimated>
            <div className="flex items-center gap-2 cursor-pointer text-sm">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Request New Category</span>
            </div>
          </LinkButtonAnimated>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsForm;
