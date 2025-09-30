"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, TLoginSchema } from "@/schemas/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ofetch } from "ofetch";
import { api } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TLoginSchema) =>
      await api("/api/sign-in", {
        method: "POST",
        body: values,
      }),
    onSuccess: (data) => {
      router.push("/dashboard");
      toast.success("ورود با موفقیت انجام شد");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values);
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>ورود به حساب کاربری</CardTitle>
        <CardDescription>
          مشخصات خود را وارد کنید تا به حساب کاربری خود وارد شوید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">نام کاربری</Label>
              <Input
                id="username"
                dir="ltr"
                className="placeholder:text-right"
                placeholder="john_doe"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                dir="ltr"
                className="placeholder:text-right"
                id="password"
                placeholder="********"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "ورود به حساب کاربری"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
