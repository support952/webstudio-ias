import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const { toast } = useToast();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32" data-testid="section-contact">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-neon-pink/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-neon-cyan text-sm font-medium uppercase tracking-widest" data-testid="text-contact-label">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-contact-title">
            Let's Start a{" "}
            <span className="gradient-text">Project</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Ready to bring your vision to life? Reach out and let's discuss how we can help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="glass-card rounded-md p-6 sm:p-8 space-y-5"
                data-testid="form-contact"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-slate-300">Your Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 focus:ring-neon-purple/20"
                            {...field}
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-slate-300">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 focus:ring-neon-purple/20"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-slate-300">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Project Inquiry"
                          className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 focus:ring-neon-purple/20"
                          {...field}
                          data-testid="input-subject"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-slate-300">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your project..."
                          rows={5}
                          className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 focus:ring-neon-purple/20 resize-none"
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
                  data-testid="button-submit-contact"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {[
              {
                icon: Mail,
                label: "Email Us",
                value: "hello@webstudio.com",
                href: "mailto:hello@webstudio.com",
                color: "text-neon-purple",
                bg: "bg-neon-purple/10",
              },
              {
                icon: SiWhatsapp,
                label: "WhatsApp",
                value: "+1 (555) 123-4567",
                href: "https://wa.me/15551234567",
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
              },
              {
                icon: MessageCircle,
                label: "Live Chat",
                value: "Available 24/7",
                href: "#",
                color: "text-neon-cyan",
                bg: "bg-neon-cyan/10",
              },
              {
                icon: MapPin,
                label: "Location",
                value: "San Francisco, CA",
                href: "#",
                color: "text-neon-pink",
                bg: "bg-neon-pink/10",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 p-5 glass-card rounded-md transition-all duration-300 gradient-border group"
                data-testid={`link-contact-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-md ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</div>
                  <div className="text-sm text-white font-medium">{item.value}</div>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
