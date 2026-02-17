"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from "lucide-react";

interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'url' | 'tel' | 'video' | 'file' | 'radio' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormBuilderProps {
  onFormChange: (fields: FormField[]) => void;
  initialFields?: FormField[] | null;
}

const FormBuilder = ({ onFormChange, initialFields }: FormBuilderProps) => {
  const [fields, setFields] = useState<FormField[]>(initialFields || []);

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onFormChange(updatedFields);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    onFormChange(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    onFormChange(updatedFields);
  };

  const addOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const options = field.options || [];
    updateField(fieldIndex, { options: [...options, 'New Option'] });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const field = fields[fieldIndex];
    const options = field.options || [];
    options[optionIndex] = value;
    updateField(fieldIndex, { options });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    const options = field.options || [];
    updateField(fieldIndex, { options: options.filter((_, i) => i !== optionIndex) });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <CardTitle className="text-sm">Field {index + 1}</CardTitle>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Field Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value: FormField['type']) => updateField(index, { type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="tel">Phone</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="radio">Radio Button</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="video">Video Upload</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Field Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                  placeholder="Enter field label"
                />
              </div>
            </div>

            <div>
              <Label>Placeholder Text</Label>
              <Input
                value={field.placeholder || ''}
                onChange={(e) => updateField(index, { placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`required_${field.id}`}
                checked={field.required}
                onChange={(e) => updateField(index, { required: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor={`required_${field.id}`}>Required field</Label>
            </div>

            {field.type === 'select' && (
              <div>
                <Label>Options</Label>
                <div className="space-y-2">
                  {(field.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        placeholder="Option text"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index, optionIndex)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(index)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {(field.type === 'radio' || field.type === 'checkbox') && (
              <div>
                <Label>Options</Label>
                <div className="space-y-2">
                  {(field.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        placeholder="Option text"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index, optionIndex)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(index)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addField}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Form Field
      </Button>

      {fields.length > 0 && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <div key={field.id}>
                <Label>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    disabled
                  />
                ) : field.type === 'select' ? (
                  <select className="w-full p-2 border rounded-md" disabled>
                    <option>{field.placeholder || 'Select an option'}</option>
                    {field.options?.map((option, i) => (
                      <option key={i}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'video' ? (
                  <div className="w-full p-2 border rounded-md bg-gray-100 text-gray-500">
                    📹 Video upload field (Max: 100MB, MP4 only)
                  </div>
                ) : field.type === 'file' ? (
                  <div className="w-full p-2 border rounded-md bg-gray-100 text-gray-500">
                    📎 File upload field (Max: 50MB, PDF/DOC/DOCX)
                  </div>
                ) : field.type === 'radio' ? (
                  <div className="space-y-2">
                    {field.options?.map((option, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="radio" name={field.id} disabled className="rounded" />
                        <span className="text-sm">{option}</span>
                      </div>
                    )) || <div className="text-gray-500 text-sm">No options added</div>}
                  </div>
                ) : field.type === 'checkbox' ? (
                  <div className="space-y-2">
                    {field.options?.map((option, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="checkbox" disabled className="rounded" />
                        <span className="text-sm">{option}</span>
                      </div>
                    )) || <div className="text-gray-500 text-sm">No options added</div>}
                  </div>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormBuilder;